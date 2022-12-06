import React, { useCallback, useContext, useEffect, useState } from "react";
import ChatBox from "../components/chat/ChatBox";
import Chats from "../components/chat/Chats";
import useHttp from "../components/hooks/use-http";
import Loader from "../components/Layout/Loader";
import SideBar from "../components/Layout/SideBar";
import { getUserChats } from "../components/lib/api";
import loginContext from "../store/login-context";
import io from "socket.io-client";

function ChatPage(props) {
  const [chats, setChats] = useState("");
  const { data, execute, loading } = useHttp(getUserChats);
  const [chatId, setChatId] = useState(null);
  const [chatInfo, setChatInfo] = useState(null);
  const [chatBoxToggle, setChatBoxToggle] = useState(false);
  const loginCtx = useContext(loginContext);
  const { userProfile } = loginCtx;
  let index;

  const selectedChat = (id, chat) => {
    setChatBoxToggle(true);
    setChatId(id);
    setChatInfo(chat);
    const index = chats.findIndex((item) => item._id === id);
    setChats((prev) => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        notification: null,
      },
      ...prev.slice(index + 1),
    ]);
  };
  if (chats) index = chats.findIndex((item) => item._id === chatId);
  // console.log(chatId, index);

  const { onSuccess } = props;
  const createNewChat = useCallback(
    (chat) => {
      if (!chats || !chats.find((item) => item._id === chat._id)) {
        setChats((prev) => [...prev, chat]);
        setChatId(chat._id);
      }
      onSuccess(false);
    },
    [chats, onSuccess]
  );

  const updateChats = useCallback(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    document.title = "Chats | Ignis Messenger";
  }, []);

  useEffect(() => {
    execute();
  }, [execute]);

  // console.log(data, index);
  // console.log(chats);
  useEffect(() => {
    if (!loading && data && data.length > 0) {
      if (index >= 0 && index !== -1) {
        // console.log("in here", data, index, chats);
        setChatId(chats[index]._id);
        setChatInfo(chats[index]);
      } else {
        // console.log("else", index);
        data.length > 0 && setChatId(data[data.length - 1]._id);
        data.length > 0 && setChatInfo(data[data.length - 1]);
      }
    }
  }, [loading, data, index, chats]);

  useEffect(() => {
    if (!loading && data && data.length > 0) setChats(data);
  }, [data, loading]);

  // const URL = "http://localhost:8080";
  const URL = "https://ignismessenger.vercel.app/";
  // const [socketConnect, setSocketConnect] = useState(false);
  const socket = io(URL);
  useEffect(() => {
    socket.emit("setup", userProfile);
    socket.on("connected", () => {
      // setSocketConnect(true);
      socket.on("hello world", () => {});
    });
  }, [userProfile, socket]);
  socket.on("hello world", () => {});

  let myChats;
  if (loading) myChats = <Loader />;
  if (data && !chats)
    myChats = (
      <h1>
        <p>No chats found</p>
        To create a new chat, Click on search icon on top left corner and search
        a user to chat with.
      </h1>
    );
  if (loading === false && chats) {
    myChats = (
      <Chats chats={chats} onAdd={createNewChat} onClick={selectedChat} />
    );
  }
  return (
    // <div className="h-[91.5vh] lg:flex block">
    <div className="h91 lg:flex block">
      <SideBar
        onAdd={createNewChat}
        searchToggle={props.searchToggle}
        onSuccess={props.onSuccess}
      />
      {/* <div className="flex-1 bg-an-1 text-an-text lg:p-8 md:p-8 p-6 flex flex-col lg:h-[auto] h-[91.5vh]"> */}
      <div className="flex-1 bg-an-1 text-an-text lg:p-8 md:p-8 p-6 flex flex-col lg:h-[auto] h91">
        {myChats}
      </div>
      {chatId && chatInfo && (
        <ChatBox
          chatId={chatId}
          chatInfo={chatInfo}
          updateChats={updateChats}
          toggle={chatBoxToggle}
          onToggle={setChatBoxToggle}
          socket={socket}
          setChats={setChats}
        />
      )}
    </div>
  );
}

export default ChatPage;
