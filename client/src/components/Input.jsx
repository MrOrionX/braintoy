import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Attach from "../img/attach.png";
import File from "../img/uploaded_file.png";
import { v4 as uuid } from "uuid";

const Input = () => {
  const { currentUser, currentUID } = useContext(AuthContext);
  const {
    activeChatID,
    activeChatmate,
    activeChatmateID,
    updateChatMessages,
    fileUploadError,
    updateFileUploadError,
  } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [filePath, setFilePath] = useState("");

  const handleSend = async () => {
    const now = new Date();

    if (text || file) {
      if (fileError) {
        setFile(null);
        setFilePath("");
      }

      try {
        const newUserMessageSent = await fetch(
          "http://localhost:8000/api/message_collection",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id1: uuid(),
              id2: uuid(),
              user_id: currentUID,
              chatid: activeChatID,
              username: currentUser,
              message: text,
              chatmate_id: activeChatmateID,
              chatmate_name: activeChatmate,
              timestamp: now.toISOString(),
              file_path: filePath,
            }),
          },
        );

        setText("");
        setPreview(false);
        setFilePath("");
        if (newUserMessageSent.ok) {
          const newChatmateMessageSent = await fetch(
            "http://localhost:8000/api/message_collection",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id1: uuid(),
                id2: uuid(),
                user_id: activeChatmateID,
                chatid: activeChatID,
                username: activeChatmate,
                message: text,
                chatmate_id: currentUID,
                chatmate_name: currentUser,
                timestamp: now.toISOString(),
                file_path: filePath,
              }),
            },
          );

          if (newChatmateMessageSent.ok) {
            updateChatMessages(activeChatID);
          } else {
            console.error(newChatmateMessageSent.status);
          }
        } else {
          console.error(newUserMessageSent.status);
        }
      } catch (err) {
        console.error("Error", err);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.code === "Enter") {
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileError(null);
      setPreview(true);

    }
  };

  useEffect(() => {
    setFileError(fileUploadError);
  }, [fileUploadError, updateFileUploadError]);

  // Take note of this useEffect(), needs to refine it.
  useEffect(() => {
    const uploadFile = async () => {
      if (file) {
        try {
          const formData = new FormData();
          formData.append("files", file);
          formData.append("chatid", activeChatID);

          const newUserFileUpload = await fetch(
            "http://localhost:8000/api/upload_files",
            {
              method: "POST",
              body: formData,
            },
          );

          if (newUserFileUpload.ok) {
            const response = await newUserFileUpload.json();
            setFilePath(response.file_paths[0]);
          } else {
            const response = await newUserFileUpload.json();
            console.error(response.error);
            setFileError(response.error);
          }
        } catch (err) {
          console.error("Error:", err);
        }
      }
    };

    uploadFile();
  }, [file, activeChatID]);

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type your message here..."
        onKeyDown={handleKeyPress}
        onChange={(e) => {
          setFileError(null);
          setText(e.target.value);
        }}
        value={text}
      />
      <div className="send">
        {preview && (
          <img src={File} alt="File Preview" style={{ maxWidth: "35px" }} />
        )}
        {fileError && <span>{fileError}</span>}
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file">
          <img src={Attach} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;

//// Backup of my original code
//import React, { useContext, useState, useEffect } from "react";
//import { AuthContext } from "../context/AuthContext";
//import { ChatContext } from "../context/ChatContext";
//import Attach from "../img/attach.png";
//import Img from "../img/img.png";
//import File from "../img/uploaded_file.png";
//import { v4 as uuid } from "uuid";

//const Input = () => {
//  const { currentUser, currentUID } = useContext(AuthContext);
//  const { activeChatID, activeChatmate, activeChatmateID, updateChatMessages, fileUploadError, updateFileUploadError } =
//    useContext(ChatContext);
//  const [text, setText] = useState("");
//  const [file, setFile] = useState(null);
//  const [preview, setPreview] = useState(null);
//  const [fileError, setFileError] = useState(null);
//  const [filePath, setFilePath] = useState("");

//  const handleSend = async () => {
//    // console.log("From Input component:", messages);
//    // console.log("currentUID:", currentUID);
//    // console.log("currentChatBotID:", activeChatmateID);
//    // console.log("currentChatBoxID:", activeChatID);

//    const now = new Date();
//////////////////////////////////////////////////////////////////////////////////
//// This should be placed in a useEffect() hook instead.
//    if (file) {
//      // Try uploading the attached file.
//      try {
//        const formData = new FormData();
//        formData.append("files", file);
//        formData.append("chatid", activeChatID);
//        console.log("FormData:", formData);
//        console.log("Chatid:", formData.get("chatid"));

//        const newUserFileUpload = await fetch(
//          "http://localhost:8000/api/upload_files",
//          {
//            method: "POST",
//            body: formData,
//          },
//        );

//        if (newUserFileUpload.ok) {
//          const response = await newUserFileUpload.json();
//          // console.log(response);
//          // console.log(response.file_paths[0]);
//          setFilePath(response.file_paths[0]);
//          // console.log("File path:", filePath);
//        } else {
//          const response = await newUserFileUpload.json();
//          console.error(response.error);
//          setFileError(response.error);
//          setPreview(null);
//        }
//      } catch (err) {
//        console.error("Error:", err);
//        setPreview(null);
//      }
//      setPreview(null);
//    }
//////////////////////////////////////////////////////////////////////////////////

//    // Wait for the filepath to be returned and include it to the
//    // argument to be passed in the text.

//    if (text) {
//      // NOTE: This part of the code should be modified if auto reply is no
//      // longer required for the project.

//      if (!fileError) {
//        setFile(null);
//      }

//      try {
//        const newUserMessageSent = await fetch(
//          "http://localhost:8000/api/message_collection",
//          {
//            method: "POST",
//            headers: {
//              "Content-Type": "application/json",
//            },
//            body: JSON.stringify({
//              id1: uuid(),
//              id2: uuid(),
//              user_id: currentUID,
//              chatid: activeChatID,
//              username: currentUser,
//              message: text,
//              chatmate_id: activeChatmateID,
//              chatmate_name: activeChatmate,
//              timestamp: now.toISOString(),
//              file_path: filePath,
//            }),
//          },
//        );

//        setText("");
//        setPreview(null);
//        if (newUserMessageSent.ok) {
//          // console.log("User message sent!");
//          const newChatmateMessageSent = await fetch(
//            "http://localhost:8000/api/message_collection",
//            {
//              method: "POST",
//              headers: {
//                "Content-Type": "application/json",
//              },
//              body: JSON.stringify({
//                id1: uuid(),
//                id2: uuid(),
//                user_id: activeChatmateID,
//                chatid: activeChatID,
//                username: activeChatmate,
//                message: text,
//                chatmate_id: currentUID,
//                chatmate_name: currentUser,
//                timestamp: now.toISOString(),
//                file_path: filePath,
//              }),
//            },
//          );

//          if (newChatmateMessageSent.ok) {
//            // console.log("Chatmate message sent!");
//            updateChatMessages(activeChatID);
//          } else {
//            console.error(newChatmateMessageSent.status);
//          }
//        } else {
//          console.error(newUserMessageSent.status);
//        }
//      } catch (err) {
//        console.error("Error", err);
//      }
//    }
//  };

//  const handleKeyPress = (e) => {
//    if (e.code === "Enter") {
//      handleSend();
//    }
//  };

//  const handleFileChange = (e) => {
//    const selectedFile = e.target.files[0];

//    if (selectedFile) {
//      setFile(selectedFile);
//      setFileError(null);

//      const reader = new FileReader();
//      reader.onloadend = () => {
//        setPreview(reader.result);
//      };
//      reader.readAsDataURL(selectedFile);
//    }
//  };

//  useEffect(() => {
//    setFileError(fileUploadError);
//  }, [fileUploadError, updateFileUploadError]);
