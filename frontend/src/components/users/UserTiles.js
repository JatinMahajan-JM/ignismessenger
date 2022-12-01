import React from "react";

function UserTiles({ item, onClick }) {
  return (
    <React.Fragment>
      <li
        style={{ display: "flex", cursor: "pointer" }}
        onClick={() => onClick({ id: item._id, name: item.name })}
        className="items-center my-3 bg-[#36404a] p-3 text-an-text"
      >
        <div>
          <img
            className="rounded-lg mr-4"
            alt="avatar"
            src={item.pic}
            width="40"
          />
        </div>
        <div>
          <div>{item.name}</div>
          <div>{item.email}</div>
        </div>
      </li>
    </React.Fragment>
  );
}

export default UserTiles;
