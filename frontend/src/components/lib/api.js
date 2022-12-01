import { token } from "../auth/getToken";
import io from "socket.io-client";
// const url = "http://localhost:8080";
const url = "";
const url2 = "https://ignismessenger.vercel.app/";
const socket = io(url2);

export async function login(loginData) {
  const res = await fetch(`${url}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...loginData }),
  });
  let data;
  data = await res.json();
  const err = data.message;
  if (res.status !== 200) {
    data = null;
    throw new Error(err);
  }
  return data;
}

export async function signUp(signUpData) {
  const res = await fetch(`${url}/api/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...signUpData }),
  });
  let data;
  data = await res.json();
  const err = data.message;
  if (res.status !== 200) {
    data = null;
    throw new Error(err);
  }
  return data;
}

export async function searchUser(search) {
  const res = await fetch(`${url}/api/user?user=${search.query}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const data = res.json();
  return data;
}

export async function createChat(args) {
  const res = await fetch(`${url}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(args.body),
  });

  let data = await res.json();
  data = data.chat ? data.chat[0] : data.fullChat;
  return data;
}

export async function getUserChats() {
  const res = await fetch(`${url}/api/chat`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await res.json();
  return data.chats;
}

export async function createNewGroup(group) {
  const res = await fetch(`${url}/api/chat/group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ name: group.name, users: group.users }),
  });
  const data = await res.json();
  return data.fullGroupChat;
}

export async function getAllMessages(chatData) {
  const res = await fetch(`${url}/api/message/${chatData.id}`, {
    headers: { Authorization: "Bearer " + token },
  });

  const data = await res.json();
  return data.messages;
}

export async function sendMessage(messageData) {
  const res = await fetch(`${url}/api/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ ...messageData }),
  });
  const data = await res.json();
  console.log(data);
  socket.emit("new message", data.message);
  return data.message;
}

export async function removeUserFromGroup(delInf) {
  const res = await fetch(`${url}/api/chat/rmvFromGroup`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ ...delInf }),
  });

  const data = res.json();
  return data;
}

export async function addUserToGroup(addInf) {
  const res = await fetch(`${url}/api/chat/addToGroup`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ ...addInf }),
  });

  const data = res.json();
  return data;
}
