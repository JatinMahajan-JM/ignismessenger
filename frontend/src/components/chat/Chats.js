import React, { useState } from "react";
import NewGroup from "./NewGroup";

function Chats(props) {
  const [showGroup, setGroup] = useState(false);
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Chats</h1>
        <button className="btn p-2" onClick={() => setGroup((prev) => !prev)}>
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
      <h1 className="font-bold my-5 text-sm">Recent</h1>
      {props.chats.length === 0 && (
        <h1>
          <p>No chats found</p>
          To create a new chat, Click on search icon on top left corner and
          search a user to chat with.
        </h1>
      )}
      <div className="overflow-y-scroll scrollbar">
        {props.chats.map((chat) => (
          <li
            key={chat._id}
            onClick={() => props.onClick(chat._id, chat)}
            className="flex gap-x-4 py-3 cursor-pointer hover:bg-an-light px-6 ease-in-out duration-700 items-center"
          >
            <img
              src={chat.users[0].pic}
              alt="img"
              width="40"
              height="40"
              className="rounded-full w-[40px] h-[40px]"
            />
            <div>
              <div className="font-bold">
                {chat.isGroupChat ? chat.chatName : chat.users[1].name}
              </div>
              <div className="flex">
                {chat.notification && (
                  <div className="bg-green-600 text-black p-1 w-[20px] h-[20px] rounded-full inline-block text-center mr-2 text-xs">
                    {chat.notification}
                  </div>
                )}
                <div className="text-sm inline">
                  {chat.latestMessage
                    ? `${chat.latestMessage?.content.slice(0, 30)}.....`
                    : "Be the first to start the chat...."}
                </div>
              </div>
            </div>
          </li>
        ))}
      </div>
      {showGroup && <NewGroup onAdd={props.onAdd} setGroup={setGroup} />}
    </React.Fragment>
  );
}

export default Chats;
