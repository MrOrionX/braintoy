import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import TimeStamp from "./TimeStamp";

const Chats = () => {
  const { currentUser, currentUID, chatBotID } = useContext(AuthContext);
  const {
    updateChatMessages,
    updateActiveChatmate,
    updateActiveChatmateID,
    updateActiveChatID,
    messagesChanged,
    updateFileUploadError,
  } = useContext(ChatContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/chat_collection?userid=${currentUID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setChats(data);
        } else {
          const errorData = await response.json();
          console.error("Error: ", response.status, " ", errorData);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    currentUID && getChats();
  }, [currentUser, currentUID, chatBotID, messagesChanged]);

  const handleSelect = async (chatid, chatmate, chatmateid) => {
    await updateChatMessages(chatid);
    await updateActiveChatmate(chatmate);
    await updateActiveChatmateID(chatmateid);
    await updateActiveChatID(chatid);
    await updateFileUploadError(null);
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => {
          const timestampAinput =
            a[1]?.messages[a[1].messages.length - 1]?.timestamp;
          const timestampBinput =
            b[1]?.messages[b[1].messages.length - 1]?.timestamp;
          const timestampA = Date.parse(timestampAinput);
          const timestampB = Date.parse(timestampBinput);
          return timestampB - timestampA;
        })
        .map((chat) => {
          const lastMessage = chat[1]?.messages[chat[1].messages.length - 1];

          return (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() =>
                handleSelect(
                  chat[0],
                  chat[1].chatmate["chatmatename"],
                  chat[1].chatmate["chatmateid"],
                )
              }
            >
              <img
                src={`/avatar/${chat[1].chatmate["chatmatename"]}.jpg`}
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/avatar/default.jpg";
                }}
              />
              <div className="userChatInfo">
                <span>{chat[1]?.chatmate?.chatmatename}</span>
                <div className="messagePreview">
                  <p>
                    {lastMessage
                      ? lastMessage.message.length <= 10
                        ? lastMessage.message
                        : `${lastMessage.message.substring(0, 10)}...`
                      : ""}
                  </p>
                  <TimeStamp timestamp={lastMessage?.timestamp} />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;

// Model of chat collection for reference
// "0": {
//      "10": {
//          "username": "Jon",
//          "chatmate": {"chatmatename": "Alexa", "chatmateid": "1"},
//          "messages": [],
//      },
//      "20": {
//          "username": "Jon",
//          "chatmate": {"chatmatename": "Iris", "chatmateid": "2"},
//          "messages": [],
//      },
//  },

// Message data structure should be:
// "messages": [
//   {
//     "key_id": "b2d82bc1-2bb4-4602-bd47-ebdeec86029b",
//     "user_id": "0",
//     "username": "Alexa",
//     "message": "Hello!",
//     "timestamp": "2023-11-17T10:31:04.557738"
//   },
