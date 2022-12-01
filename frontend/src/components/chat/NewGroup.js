import React, { useEffect, useRef, useState } from "react";
import useHttp from "../hooks/use-http";
import Backdrop from "../Layout/Backdrop";
import Loader from "../Layout/Loader";
import Modal from "../Layout/Modal";
import { createNewGroup, searchUser } from "../lib/api";
import UserTiles from "../users/UserTiles";

function NewGroup({ onAdd, setGroup }) {
  const [names, setNames] = useState([]);
  const [searchedUser, setSearchedUser] = useState("");
  const groupNameRef = useRef();
  const { execute, data, loading } = useHttp(searchUser);
  const {
    execute: executeGrp,
    data: dataGrp,
    loading: loadingGrp,
    error,
  } = useHttp(createNewGroup);

  const addName = (user) => {
    if (!names.find((item) => item.id === user.id))
      setNames((prev) => [...prev, user]);
  };

  const removeName = (id) => {
    setNames((prev) => prev.filter((item) => item.id !== id));
  };

  const createGroup = () => {
    const usersIds = names.map((user) => user.id);
    executeGrp({
      name: groupNameRef.current.value,
      users: usersIds,
    });
  };

  let tiles;
  if (loading) tiles = <Loader />;

  if (loading === false) {
    if (data?.users.length > 0)
      tiles = (
        <ul className="h-[10rem] overflow-y-scroll scrollbar mt-4">
          {data?.users.map((item) => (
            <UserTiles key={item._id} item={item} onClick={addName} />
          ))}
        </ul>
      );
    else tiles = <h1>No user found</h1>;
  }
  useEffect(() => {
    if (searchedUser) {
      const identifier = setTimeout(() => {
        execute({ query: searchedUser });
      }, 1000);
      return () => {
        clearTimeout(identifier);
      };
    }
  }, [searchedUser, execute]);

  useEffect(() => {
    if (loadingGrp === false) {
      onAdd(dataGrp);
      if (!error) setGroup(false);
    }
  }, [loadingGrp, dataGrp, onAdd, setGroup, error]);

  return (
    <React.Fragment>
      {/* <Loader /> */}
      <Backdrop />
      <Modal
        buttonName="Create Group"
        onClick={createGroup}
        setToggle={setGroup}
      >
        <form className="flex flex-col gap-y-4 mb-5">
          <h1 className="text-xl mb-5 font-bold">Create New Group</h1>
          <input
            type="text"
            placeholder="Group Name"
            ref={groupNameRef}
            className="inputs"
          />
          <input
            type="text"
            placeholder="Add users"
            onChange={(e) => setSearchedUser(e.target.value)}
            className="inputs"
          />
        </form>
        {names.map((item, index) => (
          <span
            className="bg-an-2 p-2 rounded-lg mr-2"
            key={index}
            onClick={() => removeName(item.id)}
          >
            {item.name}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 inline-block ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        ))}
        {tiles}
      </Modal>
    </React.Fragment>
  );
}

export default NewGroup;
