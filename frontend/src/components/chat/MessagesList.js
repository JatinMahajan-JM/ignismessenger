import React, { useContext } from "react";
import loginContext from "../../store/login-context";

function MessagesList({ messages }) {
  const loginCtx = useContext(loginContext);
  const { userProfile } = loginCtx;
  const check = userProfile.email;
  if (messages.length === 0) return <div>No messages found</div>;
  return (
    <div>
      {messages.map((message) => (
        // <div key={message._id}>{message.content}</div>
        <div
          key={message._id}
          className={`${
            message.sender.email === check ? "text-end mb-4" : "mb-4"
          }`}
        >
          <div
            className={`inline-flex items-end relative lg:w-1/2 md:w-1/2 w-11/12 ${
              message.sender.email === check
                ? "lg:flex-row-reverse md:flex-row-reverse flex-col-reverse"
                : ""
            }`}
          >
            <div className="flex-[0_0_30px] md:flex-[0_0_40px] lg:flex-[0_0_40px]">
              <img
                alt="sender avatar"
                src={message.sender.pic}
                width="40"
                className="lg:w-[40px] lg:h-[40px] md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-full align-middle"
              />
            </div>
            <div
              className={`${message.sender.email === check ? "mr-4" : "ml-4"}`}
            >
              <div
                className={`font-medium mb-2 border-transparent right-auto bg-an-button rounded-lg text-white p-4 relative before:absolute before:content-[''] before:bottom-[-0.375rem]

              ${
                message.sender.email === check
                  ? "before:right-0 before:border-b-4 before:border-b-[transparent] before:border-l-4 before:border-l-[transparent] before:border-r-4 before:border-r-an-button before:border-t-4 before:border-t-an-button rounded-br-none "
                  : "before:left-0 before:border-t-4 before:border-t-an-button before:border-r-4 before:border-r-[transparent] before:border-l-4 before:border-l-an-button before:border-b-4 before:border-b-[transparent] rounded-bl-none"
              }
               `}
              >
                <p className="wordBreak text-sm align text-left">
                  {message.content}
                </p>
              </div>
              <div className="text-sm">
                {message.sender.email === check ? "You" : message.sender.name}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesList;
