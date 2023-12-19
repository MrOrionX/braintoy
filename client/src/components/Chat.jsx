import React, { useContext, useState } from "react";
import Middle from "./Middle";
import Messages from "./Messages";
import Input from "./Input";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const defaultAvatar = "/avatar/default.jpg";
  const avatarPath = `/avatar/${currentUser}.jpg`;
  const [data, setData] = useState([]);

  const handleDataSubmit = (newData) => {
    setData([...data, newData]);
  };

  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  return (
    <div className="chat">
      <div className="chatNav">
        <div className="category">
          <button>Friends</button>
          <button>Work</button>
          <button>Family</button>
          <button>+ Category</button>
        </div>
        <div className="user">
          <img
            src={avatarPath}
            alt={`${currentUser}'s avatar`}
            onError={handleImageError}
          />
          <div className="userInfo">
            <p>{currentUser}</p>
            <select name="" id="">
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>
      <Middle />
      <Messages data={data} />
      <Input onDataSubmit={handleDataSubmit} />
    </div>
  );
};

export default Chat;
