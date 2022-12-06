import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import useHttp from "./components/hooks/use-http";
import { login, signUp } from "./components/lib/api";
import LoginContext from "./store/login-context";
import ErrorPage from "./components/Layout/ErrorPage";
import MainNavigation from "./components/Layout/MainNavigation";

function App() {
  // console.log("exee");
  const {
    execute: exeLogin,
    data: loginData,
    error: loginErr,
  } = useHttp(login);
  const {
    execute: exeSignUp,
    data: signUpData,
    error: signupErr,
  } = useHttp(signUp);

  const [searchToggle, setSearchToggle] = useState(false);
  const loginCtx = useContext(LoginContext);
  const { isAuth, token, setAuthentication, findAuthentication, logout } =
    loginCtx;

  useEffect(() => {
    findAuthentication();
  }, [findAuthentication]);

  useEffect(() => {
    if (loginData !== null) setAuthentication(loginData);
  }, [loginData, setAuthentication]);

  useEffect(() => {
    if (signUpData !== null) setAuthentication(signUpData);
  }, [signUpData, setAuthentication]);

  let routes = (
    <Routes>
      <Route path="/" element={<Login onLogin={exeLogin} err={loginErr} />} />
      <Route
        path="/signup"
        element={<SignUp onSignUp={exeSignUp} err={signupErr} />}
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );

  if (isAuth) {
    routes = (
      <MainNavigation onSet={setSearchToggle} onLogout={logout}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route
            path="/"
            element={
              <ChatPage
                token={token}
                searchToggle={searchToggle}
                onSuccess={setSearchToggle}
              />
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </MainNavigation>
    );
  }
  return <React.Fragment>{routes}</React.Fragment>;
}

export default App;
