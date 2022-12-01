import React, { useContext, useState } from "react";
import loginContext from "../../store/login-context";
import Backdrop from "./Backdrop";
import Modal from "./Modal";

function MainNavigation({ onSet, children, onLogout }) {
  const [showProfile, setProfile] = useState(false);
  const loginCtx = useContext(loginContext);
  const { userProfile } = loginCtx;
  return (
    <div className="flex flex-col w-full font-PS">
      <div className="flex justify-between items-center p-4 px-6 bg-[#36404a] text-[#a6b0cf] h-[8.5vh] md:px-12 lg:px-12">
        <div
          className="bg-[#3e4a56] p-2 rounded-lg cursor-pointer"
          onClick={() => onSet((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <h1 className="font-PS text-lg text-[#e1e9f1] font-bold select-none">
          ignis Messenger
        </h1>
        <div
          className="bg-[#3e4a56] p-2 rounded-lg cursor-pointer"
          onClick={() => setProfile((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
      </div>
      {showProfile && (
        <React.Fragment>
          <Backdrop />
          <Modal setToggle={setProfile} buttonName="Logout" onClick={onLogout}>
            <h1 className="text-xl mb-5 font-bold">User Profile</h1>
            <div className="text-white gap-y-3 flex flex-col">
              <img
                alt="img"
                src={userProfile.pic}
                width="60"
                className="rounded-full w-[50px] h-[50px]"
              />
              <h1>
                <span className="text-sm font-bold">Your Email</span> -{" "}
                {userProfile.email}
              </h1>
              <h1>
                <span className="text-sm font-bold">UserName</span> -{" "}
                {userProfile.name}
              </h1>
            </div>
          </Modal>
        </React.Fragment>
      )}
      {children}
    </div>
  );
}

export default MainNavigation;
