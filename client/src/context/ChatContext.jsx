import { useState, createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUID } = useContext(AuthContext);
  const [activeChatmate, setActiveChatmate] = useState(null);
  const [activeChatmateID, setActiveChatmateID] = useState(null);
  const [activeChatID, setActiveChatID] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastmessage, setLastMessage] = useState({});
  const [messagesChanged, setMessagesChanged] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("");

  const updateFileUploadError = (newFileUploadError) => {
    if (newFileUploadError) {
      setFileUploadError("");
    }
  };

  const updateActiveChatmate = (newChatmate) => {
    if (newChatmate) {
      setActiveChatmate(newChatmate);
    } else {
      setActiveChatmate(null);
    }
  };

  const updateActiveChatmateID = (newChatmateID) => {
    if (newChatmateID) {
      setActiveChatmateID(newChatmateID);
    } else {
      setActiveChatmateID(null);
    }
  };

  const updateActiveChatID = (newChatID) => {
    if (newChatID) {
      setActiveChatID(newChatID);
    } else {
      setActiveChatID(null);
    }
  };

  const updateChatMessages = async (newChatID) => {
    if (newChatID) {
      try {
        // Connect to backend
        const response = await fetch(
          `http://localhost:8000/api/chat_collection?userid=${currentUID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        // console.log("New Current UID:", currentUID);
        // console.log("New Chat ID:", newChatID);

        if (response.ok) {
          try {
            const data = await response.json();
            // console.log("Chat data:", data);
            // Extract the messages array using chatid (note data is an object)
            // setMessages(messagesArray);
            setMessages(data[newChatID]?.messages);
            // console.log("Chat messages:", messages);
          } catch (jsonError) {
            console.error("Error parsing JSON response:", jsonError);
          }
        } else {
          console.error("Error:", response.status);
          try {
            const errorData = await response.json();
            console.error("Error details:", errorData);
          } catch (jsonError) {
            console.error("Error parsing JSON error response:", jsonError);
          }
        }
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      setMessages([]);
    }

    setMessagesChanged(!messagesChanged);
  };

  const updateLastMessage = () => {
    setLastMessage(messages[messages.length - 1]);
  };

  return (
    <ChatContext.Provider
      value={{
        updateChatMessages,
        activeChatmate,
        updateActiveChatmate,
        activeChatmateID,
        updateActiveChatmateID,
        activeChatID,
        updateActiveChatID,
        messages,
        lastmessage,
        updateLastMessage,
        messagesChanged,
        fileUploadError,
        updateFileUploadError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

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
//
//  Model of chat collection with messages
//
//  "0": {
//    "10": {
//      "user": {
//        "username": "Jon",
//        "userid": "0"
//      },
//      "chatmate": {
//        "chatmatename": "Alexa",
//        "chatmateid": "1"
//      },
//      "messages": [
//        {
//          "key_id": "725fb07a-3525-4a77-a0f0-d1e3456073af",
//          "user_id": "0",
//          "message": "Hello World!!!",
//          "timestamp": "2023-11-16T21:32:35.319326"
//        }
//      ]
//    }
