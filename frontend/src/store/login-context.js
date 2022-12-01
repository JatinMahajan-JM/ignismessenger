import React from "react";

const loginContext = React.createContext({
  isAuth: false,
  userId: null,
  token: null,
  userProfile: null,
  logout: () => {},
  autoLogout: () => {},
  setAuthentication: () => {},
  findAuthentication: () => {},
});

export default loginContext;
