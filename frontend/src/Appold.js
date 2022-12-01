import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Home from "./pages/Home";
import asyncHandler from "./components/hooks/asyncHandler";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";

function App() {
  const url = "http://localhost:8080";
  const [authState, setAuthState] = useState({
    isAuth: false,
    token: null,
    userId: null,
  });

  console.log(authState);

  const setAuthentication = (data) => {
    setAuthState((prev) => {
      return { ...prev, isAuth: true, token: data.token };
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    const remainingMilliseconds = 60 * 60 * 1000;
    const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
    localStorage.setItem("expiryDate", expiryDate.toISOString());
    autoLogout(remainingMilliseconds);
  };

  const signUp = asyncHandler(async (name, email, password) => {
    const res = await fetch(`${url}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.status === 200) {
      setAuthentication(data);
    }
  });

  const login = asyncHandler(async (email, password) => {
    console.log(email);
    const res = await fetch(`${url}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.status === 200) {
      setAuthentication(data);
    }
  });

  const autoLogout = useCallback((ms) => {
    setTimeout(() => {
      logout();
    }, ms);
  }, []);

  const logout = () => {
    setAuthState((prev) => {
      return { ...prev, isAuth: false, token: null };
    });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("status");
    localStorage.removeItem("expiryDate");
  };

  useEffect(() => {
    const expiryDate = localStorage.getItem("expiryDate");
    const token = localStorage.getItem("token");
    if (!token || !expiryDate) return;
    if (new Date(expiryDate) <= new Date()) {
      logout();
      return;
    }
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setAuthState({ isAuth: true, token: token, userId: userId });
    autoLogout(remainingMilliseconds);
  }, [autoLogout]);

  let routes = (
    <Routes>
      <Route path="/" element={<Login onLogin={login} />} />
      <Route path="/signup" element={<SignUp onSignUp={signUp} />} />
      <Route path="*" element={<Login onLogin={login} />} />
    </Routes>
  );

  if (authState.isAuth) {
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<ChatPage token={authState.token} />} />
      </Routes>
    );
  }
  return <React.Fragment>{routes}</React.Fragment>;
}

export default App;
