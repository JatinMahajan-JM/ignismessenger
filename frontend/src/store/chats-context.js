const chatsContext = React.createContext({
  chats: [],
  addChat: () => {},
  removeChat: () => {},
});

export default chatsContext;
