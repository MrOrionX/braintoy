import { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUID, setCurrentUID] = useState(null);
  const [chatBot, setChatBot] = useState(null);
  const [chatBotID, setChatBotID] = useState(null);
  const [chatID, setChatID] = useState(null);

  // Function to update the currentUser and currentUID
  const updateCurrentUser = (newUser = null) => {
    if (newUser) {
      setCurrentUser(newUser.username);
      setCurrentUID(newUser.uid);
    } else {
      setCurrentUser(null);
      setCurrentUID(null);
    }
  };

  const updateCurrentUserID = (newUserID = null) => {
    if (newUserID) {
      setCurrentUID(newUserID);
    } else {
      setCurrentUID(null);
    }
  };

  const updateCurrentUserName = (newUserName = null) => {
    if (newUserName) {
      setCurrentUser(newUserName);
    } else {
      setCurrentUser(null);
    }
  }

  // Function to update the chatbot
  const updateCurrentChatBot = (newChatBot = null) => {
    if (newChatBot) {
      setChatBot(newChatBot.username);
      setChatBotID(newChatBot.uid);
    } else {
      setChatBot(null);
      setChatBotID(null);
    }
  };

  const updatechatBotID = (newChatmateID = null) => {
    if (newChatmateID) {
      setChatBotID(newChatmateID);
    } else {
      setChatBotID(null);
    }
  };

  const updateChatBot = (newChatBotName = null) => {
    if (newChatBotName) {
      setChatBot(newChatBotName);
    } else {
      setChatBot(null);
    }
  }

  // Server reload function
  const serverReload = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/server_reload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Server reload initiated successfully.");
      } else {
        console.error("Failed to initiate server reload:", response.status);
      }
    } catch (error) {
      console.error("Error while initiating server reload:", error);
    }
  };

  // Add function for chatid
  const updateChatID = (newChatmateID = null) => {
    if (newChatmateID) {
      const combinedId =
        currentUID > chatBotID
          ? currentUID + chatBotID
          : chatBotID + currentUID;
      setChatID(combinedId);
    } else {
      setChatID(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUID,
        updateCurrentUserName,
        updateCurrentUserID,
        updateCurrentUser,
        chatBot,
        chatBotID,
        updateChatBot,
        updatechatBotID,
        updateCurrentChatBot,
        serverReload,
        chatID,
        updateChatID,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

