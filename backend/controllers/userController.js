const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const errHandler = require("../util/asyncHandler");
const bcrypt = require("bcryptjs");

exports.register = errHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  let token = null;
  if (!name || !email || !password) {
    throw new Error("Please enter all fields");
  }

  const user = await userModel.findOne({ email: email });
  if (user) throw new Error("User already exists");

  const hashedPass = await bcrypt.hash(password, 12);
  const newUser = new userModel({
    name,
    email,
    password: hashedPass,
    pic,
  });
  const resData = await newUser.save();

  if (resData.name) {
    token = jwt.sign({ email: email, userId: newUser._id }, "secret", {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "user created successfully",
      token,
      userId: newUser._id,
      name: newUser.name,
      pic: newUser.pic,
      email: newUser.email,
    });
  } else {
    res.status(401).json({ message: "Error creating new user" });
  }
});

exports.login = errHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let token = null;
  const user = await userModel.findOne({ email: email });
  if (user && (await bcrypt.compare(password, user.password))) {
    token = jwt.sign({ email: user.email, userId: user._id }, "secret", {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      message: "Login successful",
      userId: user._id,
      name: user.name,
      pic: user.pic,
      email: user.email,
    });
  } else {
    res.status(401).json({ message: "Email or password does not match" });
  }
});

exports.getSearchedUsers = errHandler(async (req, res, next) => {
  const name = req.query.user;
  if (name.trim() === "") return res.status(200).json({ users: [] });
  const users = await userModel.find({
    $and: [
      { name: { $regex: name, $options: "i" } },
      { _id: { $ne: req.userId } },
    ],
  });
  res.status(200).json({ users });
});
