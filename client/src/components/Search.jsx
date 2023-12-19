import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const {
    currentUser,
    currentUID,
    chatBot,
    updateChatBot,
    updateCurrentChatBot,
    chatBotID,
  } = useContext(AuthContext);
  const [chatmate, setChatmate] = useState("");
  const [err, setErr] = useState(false);
  const defaultAvatar = "/avatar/default.jpg";
  const avatarPath = `/avatar/${chatBot}.jpg`;

  // console.log("Current logged-in user: ", currentUser);
  // console.log("Current logged-in user id: ", currentUID);
  // console.log("Current chatBot: ", chatBot);
  // console.log("Current chatBot id: ", chatBotID);

  // Modify handleSearch to search for a chatBot
  const handleSearch = async () => {
    try {
      // Connect to backend
      const response = await fetch(
        `http://localhost:8000/api/current_user?username=${chatmate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setChatmate("");
      if (response.ok) {
        const data = await response.json();
        console.log("Response data: ", data);
        if (data !== null) {
          updateCurrentChatBot(data);
          setErr(false);
        } else {
          console.error("Returned data is null");
          setErr(true);
        }
      } else {
        // Handle non-200 status codes
        console.error("Error:", response.status);
        setErr(true);
      }
    } catch (err) {
      // Handle network errors or other exceptions
      console.error("Error:", err);
      setErr(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  // When you click a user, update the chatbot!
  const handleSelect = async () => {

    // Check whether the chat collection exist.
    const combinedId =
      currentUID > chatBotID ? currentUID + chatBotID : chatBotID + currentUID;

    try {
      // Connect to backend
      const response = await fetch(
        `http://localhost:8000/api/chat_collection?userid=${currentUID}&
        chatid=${combinedId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const newChatResponse = await fetch(
          "http://localhost:8000/api/chat_collection",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: currentUID,
              currentuser: currentUser,
              chatid: combinedId,
              chatbot: chatBot,
              chatbotid: chatBotID,
            }),
          },
        );

        if (newChatResponse.ok) {
          const secondFetchResponse = await fetch(
            "http://localhost:8000/api/chat_collection",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: chatBotID,
                currentuser: chatBot,
                chatid: combinedId,
                chatbot: currentUser,
                chatbotid: currentUID,
              }),
            },
          );

          if (secondFetchResponse.ok) {
            const secondFetchData = await secondFetchResponse.json();
            // console.log("Second fetch success: ", secondFetchData);
          } else {
            console.error(
              "Error in the second fetch: ",
              secondFetchResponse.status,
            );
            const errorData = await secondFetchResponse.json();
            console.error("Error details: ", errorData.detail);
          }
        } else {
          // Handle the error from the first fetch
          const newChatErrorData = await newChatResponse.json();
          console.error("Error creating new chat: ", newChatResponse.status);
          console.error("Error details: ", newChatErrorData.detail);
        }
      } else {
        // Handles other responses other than 404
        const errorData = await response.json();
        console.error("Error: ", response.status);
        console.error("Error details: ", errorData.detail);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
    updateChatBot("");
  };

  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a chatmate"
          onKeyDown={handleKeyPress}
          onChange={(e) => {
            setChatmate(e.target.value);
          }}
          value={chatmate}
        />
      </div>
      {chatBot && (
        <div className="userChat" onClick={handleSelect}>
          <img
            src={avatarPath}
            alt={`${chatBot}'s avatar`}
            onError={handleImageError}
            value={chatmate}
          />
          <div className="userChatInfo">
            <span>{chatBot}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
