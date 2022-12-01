import { useCallback, useReducer } from "react";
import setToken from "../components/auth/getToken";
import LoginContext from "./login-context";

const reducerFn = (state, action) => {
  switch (action.type) {
    case "logout":
      return { ...state, isAuth: false, token: null, userProfile: null };
    case "authenticated":
      return {
        userId: action.userId,
        isAuth: true,
        token: action.token,
        userProfile: action.userProfile,
      };
    default:
      return state;
  }
};

function LoginProvider(props) {
  const [loginState, dispatchFn] = useReducer(reducerFn, {
    isAuth: false,
    token: null,
    userId: null,
    userProfile: null,
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("status");
    localStorage.removeItem("expiryDate");
    dispatchFn({ type: "logout" });
  };

  const autoLogout = useCallback((ms) => {
    setTimeout(() => {
      logout();
    }, ms);
  }, []);

  const setAuthentication = useCallback(
    (data) => {
      const userProfile = { name: data.name, email: data.email, pic: data.pic };
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      setToken(data.token);
      dispatchFn({
        type: "authenticated",
        userId: data.userId,
        token: data.token,
        userProfile,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem("expiryDate", expiryDate.toISOString());
      autoLogout(remainingMilliseconds);
    },
    [autoLogout]
  );

  const findAuthentication = useCallback(() => {
    const expiryDate = localStorage.getItem("expiryDate");
    const token = localStorage.getItem("token");
    const userProfile = localStorage.getItem("userProfile");
    setToken(token);
    if (!token || !expiryDate) return;
    if (new Date(expiryDate) <= new Date()) {
      logout();
      return;
    }
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    dispatchFn({
      type: "authenticated",
      userId,
      token,
      userProfile: JSON.parse(userProfile),
    });
    autoLogout(remainingMilliseconds);
  }, [autoLogout]);

  // logout();

  const loginContext = {
    ...loginState,
    logout,
    autoLogout,
    setAuthentication,
    findAuthentication,
  };
  return (
    <LoginContext.Provider value={loginContext}>
      {props.children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
