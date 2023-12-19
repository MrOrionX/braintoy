import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import logoIcon from "../img/hi_icon.png";

const Navbar = () => {
  const { updateCurrentUser, updateCurrentChatBot } = useContext(AuthContext);
  const { updateActiveChatmate, updateChatMessages } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleClick = () => {
    // This is cleaning up
    updateCurrentUser("");
    updateCurrentChatBot("");
    updateActiveChatmate(null);
    updateChatMessages(null);
    navigate("/main");
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src={logoIcon} alt="" />
        <span>iChat</span>
      </div>
      <div className="user">
        <button onClick={handleClick}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
