import React, { useEffect, useRef, useState } from "react";
import useHttp from "../hooks/use-http";
import Backdrop from "../Layout/Backdrop";
import Loader from "../Layout/Loader";
import Modal from "../Layout/Modal";
import {
  getAllMessages,
  sendMessage,
  removeUserFromGroup,
  addUserToGroup,
  searchUser,
} from "../lib/api";
import UserTiles from "../users/UserTiles";
import MessagesList from "./MessagesList";

function ChatBox({
  chatId,
  chatInfo,
  updateChats,
  toggle,
  onToggle,
  socket,
  setChats,
}) {
  const { data, execute, loading } = useHttp(getAllMessages);
  const { data: messageData, execute: executeAndSend } = useHttp(sendMessage);
  const { data: delData, execute: executeDel } = useHttp(removeUserFromGroup);
  const {
    data: searchData,
    execute: searchExecute,
    loading: searchLoading,
  } = useHttp(searchUser);
  const { data: addData, execute: executeAdd } = useHttp(addUserToGroup);
  const [showChatInfo, setChatToggle] = useState(false);
  const [searchedUser, setSearchedUser] = useState("");
  const [messagesR, setMessages] = useState(null);
  const messageRef = useRef();

  const sendMessageData = (event) => {
    event.preventDefault();
    executeAndSend({ chatId, content: messageRef.current.value });
  };

  const removeUser = (chatId, userId) => {
    if (chatInfo.users.length <= 2) return;
    executeDel({ groupId: chatId, userId });
  };

  const addUser = (chatId, userId) => {
    if (!chatInfo.users.find((item) => item._id === userId))
      executeAdd({ groupId: chatId, userId });
  };

  let messages;
  if (loading) messages = <Loader />;

  if (messagesR !== null) messages = <MessagesList messages={messagesR} />;

  let tiles;
  if (searchLoading) tiles = <Loader />;
  if (searchLoading === false) {
    tiles = (
      <ul className="max-h-[15rem] overflow-y-scroll scrollbar">
        {searchData?.users.map((item) => (
          <UserTiles
            key={item._id}
            item={item}
            onClick={() => addUser(chatInfo._id, item._id)}
          />
        ))}
      </ul>
    );
  }

  useEffect(() => {
    if (searchedUser) {
      const identifier = setTimeout(() => {
        searchExecute({ query: searchedUser });
      }, 1000);
      return () => {
        clearTimeout(identifier);
      };
    }
  }, [searchedUser, searchExecute]);

  useEffect(() => {
    execute({ id: chatId });
  }, [execute, chatId, messageData]);

  useEffect(() => {
    if (delData || addData || messageData) {
      updateChats();
    }
  }, [delData, updateChats, addData, messageData]);

  useEffect(() => {
    if (!loading) {
      socket.emit("join chat", chatId);
      setMessages(data);
    }
  }, [chatId, loading, data, socket]);

  useEffect(() => {
    socket.on("messageR", (message) => {
      if (!chatInfo || chatInfo._id !== message.chat._id) {
        setChats((prev) => {
          const index = prev.findIndex((item) => item._id === message.chat._id);
          return [
            ...prev.slice(0, index),
            {
              ...prev[index],
              notification: prev[index].notification
                ? prev[index].notification + 1
                : 1,
            },
            ...prev.slice(index + 1),
          ];
        });
      } else {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => {
      socket.off("messageR");
    };
  }, [socket, chatInfo, setChats]);

  return (
    // <div
    //   className={`flex-[3_3_0%] bg-an-2 text-an-text grid grid-rows-[1fr_7fr_1fr] lg:grid lg:static fixed lg:w-auto w-full top-[8.5vh] h-[91.5vh] ${
    //     toggle ? "" : "translate-x-full"
    //   } ease-in-out duration-500 lg:translate-x-0`}
    // >
    <div
      className={`flex-[3_3_0%] bg-an-2 text-an-text grid grid-rows-[1fr_7fr_1fr] lg:grid lg:static fixed lg:w-auto w-full top8 h91 ${
        toggle ? "" : "translate-x-full"
      } ease-in-out duration-500 lg:translate-x-0`}
    >
      {/* <div className="flex-[0_0_9.108vh]"> */}
      <div className="flex9">
        <div className="flex justify-between py-6 border-b px-10 border-an-light items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-8 h-8 btn p-2 cursor-pointer mr-8 lg:hidden`}
              onClick={() => onToggle((prev) => !prev)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            {chatInfo.chatName}
          </div>
          {/* <button onClick={() => setInfo((prev) => !prev)}>Info</button> */}
          {/* {showInfo && (
            <Modal hide="true">
              <div>{userProfile.name}</div>
              <div>{userProfile.email}</div>
              {<img alt="avatar" src={userProfile.pic} width="40" />}
            </Modal>
          )} */}
          <button
            className="btn p-2"
            onClick={() => setChatToggle((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </button>
        </div>
        {showChatInfo && (
          <div>
            <Backdrop />
            <Modal hide="true" setToggle={setChatToggle}>
              <div className="my-2">
                Name of the chat - {chatInfo.chatName.toUpperCase()}
              </div>
              <div className="overflow-y-scroll scrollbar py-4 my-2 pb-0">
                {chatInfo.users.map((user, index) => (
                  <span
                    key={user._id}
                    onClick={() => removeUser(chatInfo._id, user._id, index)}
                    className="bg-an-2 p-2 rounded-lg mr-2 inline-block  mb-3"
                  >
                    {user.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4 inline-block ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                ))}
              </div>
              <div className="mb-4">
                Created by -{" "}
                {chatInfo.groupAdmin
                  ? chatInfo.groupAdmin.name
                  : chatInfo.users[0].name}
              </div>

              {chatInfo.isGroupChat && (
                <div>
                  <input
                    type="text"
                    placeholder="Add users"
                    onChange={(e) => setSearchedUser(e.target.value)}
                    className="inputs w-full mb-3"
                  />
                  {tiles}
                </div>
              )}
            </Modal>
          </div>
        )}
      </div>
      {/* <div className="lg:p-10 md:p-10 p-5 flex-[0_0_72.864vh] overflow-y-scroll scrollbar flex flex-col-reverse pr-0"> */}
      <div className="lg:p-10 md:p-10 p-5 flex728 overflow-y-scroll scrollbar flex flex-col-reverse pr-0">
        {messages}
      </div>
      {/* <div className="px-10 flex-[0_0_9.108vh] border-an-light border-t py-6"> */}
      <div className="px-10 flex9108 border-an-light border-t py-6">
        <form onSubmit={sendMessageData} className="flex">
          <textarea
            rows="1"
            className="inputs w-full mr-5 p-3 px-7 scrollbar resize-none"
            type="text"
            placeholder="Enter Message...."
            ref={messageRef}
          />
          <button className="btn p-4 px-5" type="send">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

//overflow
export default ChatBox;
