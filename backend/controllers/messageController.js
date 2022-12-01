const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
const asyncHandler = require("../util/asyncHandler");
const errHandler = require("../util/asyncHandler");

exports.sendMessage = errHandler(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) throw new Error("Something went wrong");

  let message = new messageModel({
    sender: req.userId,
    content,
    chat: chatId,
  });
  await message.save();

  message = await (
    await message.populate("sender", "name pic")
  ).populate("chat");

  message = await userModel.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });

  await chatModel.findByIdAndUpdate(chatId, { latestMessage: message });
  res.status(200).json({ message });
});

exports.getAllMessage = errHandler(async (req, res, next) => {
  // console.log(req.params.chatId);
  let messages = await messageModel
    .find({ chat: req.params.chatId })
    .populate("sender", "name pic email")
    .populate("chat");

  res.status(202).json({ messages });
});
