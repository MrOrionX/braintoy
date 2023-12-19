import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";

const Messages = () => {
  const { currentUID } = useContext(AuthContext);
  const { messages, messagesChanged, activeChatID } = useContext(ChatContext);
  const [newMessages, setNewMessages] = useState([]);

  // console.log("From Messages current user UID:", currentUID);
  // console.log("From Messages activeChatID:", activeChatID);
  // console.log("From Messages component:", messages);
  // console.log("Message key:", messages?.key_id);
  // console.log("Message:", messages?.message);
  // console.log("UID of sender:", messages?.user_id);
  // console.log("Sender name:", messages?.username);

  useEffect(() => {
    setNewMessages(messages);
  }, [messages, messagesChanged]);

  // console.log("newMessages:", newMessages);

  return (
    <div className="messages">
      {newMessages.map((m) => (
        <Message message={m} key={m.key_id} />
      ))}
    </div>
  );
};

export default Messages;
