import React, { useEffect, useRef } from "react";
import useHttp from "../hooks/use-http";
import { createChat, searchUser } from "../lib/api";
import UserTiles from "../users/UserTiles";
import Loader from "./Loader";

function SideBar({ onAdd, searchToggle }) {
  const { execute, data, loading } = useHttp(searchUser);
  const {
    execute: executeS,
    data: dataS,
    loading: loadingS,
  } = useHttp(createChat);
  const searchRef = useRef();

  const search = (event) => {
    event.preventDefault();
    execute({ query: searchRef.current.value });
  };

  const createUsersChat = (user) => {
    executeS({ body: { userP2: user.id } });
  };

  let tiles;
  if (loading) tiles = <Loader />;

  if (loading === false) {
    if (data?.users.length === 0)
      tiles = <h1 className="text-center mt-10 text-an-text">No user found</h1>;
    else
      tiles = (
        <ul>
          {data?.users.map((item) => (
            <UserTiles key={item._id} item={item} onClick={createUsersChat} />
          ))}
          <li className="text-an-text">Click on any user to create a chat</li>
        </ul>
      );
  }

  useEffect(() => {
    if (loadingS === false && dataS !== null) {
      onAdd(dataS);
    }
  }, [loadingS, dataS, onAdd]);
  return (
    <div
      className={`absolute h-[91vh] bg-[#303841] text-white p-6 px-14 ease-in-out duration-300 z-50 ${
        searchToggle ? "" : "-translate-x-full"
      }`}
    >
      <form onSubmit={search}>
        <input
          type="text"
          ref={searchRef}
          className="inputs text-an-text mr-2"
          placeholder="search users eg.Aaron"
        />
        <button type="submit" className="btn p-2 text-an-text">
          Search
        </button>
      </form>
      {tiles}
    </div>
  );
}

export default SideBar;
