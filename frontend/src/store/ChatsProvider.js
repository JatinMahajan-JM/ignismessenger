import { useReducer } from "react";
import ChatsContext from "./chats-context";

const reducerFn = (state, action) => {
  switch (action.type) {
    case "add":
      break;
    case "remove":
      break;
    default:
      return state;
  }
};

function ChatsProvider() {
  const [chatsState, dispatchFn] = useReducer(reducerFn, { chats: [] });

  const addChatCtx = () => {
    dispatchFn({ type: "add" });
  };

  const removeChatCtx = () => {
    dispatchFn({ type: "remove" });
  };

  const chatsContext = {
    chats: chatsState.chats,
    addChat: addChatCtx,
    removeChat: removeChatCtx,
  };
  return <ChatsContext.Provider value={chatsContext}></ChatsContext.Provider>;
}

export default ChatsProvider;
