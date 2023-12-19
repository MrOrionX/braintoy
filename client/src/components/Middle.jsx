import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import { ChatContext } from "../context/ChatContext";

const Middle = () => {
  const { activeChatmate } = useContext(ChatContext);
  return (
    <div className="middle">
      <div className="chatInfo">
        <div className="chatmate">
          {activeChatmate && <p>{activeChatmate}</p>}
        </div>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Middle;
