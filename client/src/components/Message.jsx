import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import TimeStamp from "./TimeStamp";
import Attachment from "../img/documents.png";

const Message = ({ message }) => {
  const ref = useRef();
  const { currentUID } = useContext(AuthContext);
  const defaultAvatar = "/avatar/default.jpg";
  const avatarPath = `/avatar/${message.username}.jpg`;
  const [attachment, setAttachment] = useState("");

  // Use to debug, okay to delete these line of codes.
  // console.log("Received it here!", message);
  // console.log("Message:", message.message);
  // console.log("currentUID:", currentUID);
  // console.log("From Messages current user UID:", currentUID);
  // console.log("From Messages activeChatID:", activeChatID);
  // console.log("Message key:", message?.key_id);
  // console.log("Message:", message?.message);
  // console.log("UID of sender:", message?.user_id);
  // console.log("Sender name:", message?.username);
  // console.log("File path:", message?.filepath);
  // console.log(currentUID === message.user_id);

  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    if (message?.filepath) {
      const parts = message?.filepath.split("/");
      const fileName = parts[parts.length - 1];
      setAttachment(fileName);
    } else {
      setAttachment("");
    }
  }, [message?.filepath, attachment]);

  return (
    <div
      ref={ref}
      className={`message ${currentUID === message?.user_id && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={avatarPath}
          alt={`${message?.username}'s avatar`}
          onError={handleImageError}
        />
        <span className="timestamp">
          <TimeStamp timestamp={message?.timestamp} />
        </span>
      </div>
      <div className="messageContent">
        {message?.message && <p>{message?.message}</p>}
        {attachment && (
          <div className="attachment">
            <img src={Attachment} alt="Attached File" />
            <span>{attachment}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
