const errHandler = require("../util/asyncHandler");
const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

exports.getChat = errHandler(async (req, res, next) => {
  const { userP2 } = req.body;
  let chat = chatModel
    .find({
      isgroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.userId } } },
        { users: { $elemMatch: { $eq: userP2 } } },
      ],
    })
    .populate("users latestMessage", "-password");

  //populating the nested sender in chatModel, it can be populated using user model
  chat = await userModel.populate(chat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (chat.length > 0) {
    res.status(200).json({ chat });
  } else {
    console.log("else");
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.userId, userP2],
    };

    const createdChat = new chatModel(chatData);
    await createdChat.save();
    console.log(createdChat);
    const fullChat = await chatModel
      .findOne({ _id: createdChat._id })
      .populate("users", "-password");
    console.log(fullChat);
    res.status(200).json({ fullChat });
  }
});

exports.fetchChats = errHandler(async (req, res, next) => {
  let chats = await chatModel
    .find({
      users: { $elemMatch: { $eq: req.userId } },
    })
    .populate("users groupAdmin latestMessage", "-password")
    .sort({ updatedAt: -1 });

  chats = await userModel.populate(chats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  res.status(200).json({ chats });
});

exports.createGroup = errHandler(async (req, res, next) => {
  const { users } = req.body;
  if (!req.body.users) {
    throw new Error("Please add some users");
  }

  if (users.length < 2) {
    throw new Error("Please add more than 2 users to create a group");
  }

  users.push(req.userId);

  const createdGroupChat = new chatModel({
    chatName: req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.userId,
  });
  await createdGroupChat.save();

  const fullGroupChat = await createdGroupChat.populate(
    "users groupAdmin",
    "-password"
  );

  res.status(200).json({ fullGroupChat });
});

exports.renameGroup = errHandler(async (req, res, next) => {
  const { groupId, groupName } = req.body;
  const group = await chatModel
    .findByIdAndUpdate(groupId, { chatName: groupName }, { new: true })
    .populate("users groupAdmin", "-password");
  if (!group) {
    throw new Error("Some error occured");
  } else {
    res.status(200).json({ group });
  }
});

exports.addToGroup = errHandler(async (req, res, next) => {
  const { groupId, userId } = req.body;
  const added = await chatModel
    .findByIdAndUpdate(groupId, { $push: { users: userId } }, { new: true })
    .populate("users groupAdmin", "-password");
  res.status(200).json({ added });
});

exports.removeFromGroup = errHandler(async (req, res, next) => {
  const { groupId, userId } = req.body;
  const removed = await chatModel
    .findByIdAndUpdate(groupId, { $pull: { users: userId } }, { new: true })
    .populate("users groupAdmin", "-password");
  res.status(200).json({ removed });
});
