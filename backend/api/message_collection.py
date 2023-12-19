# api/message_collection.py
from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
router = APIRouter()

# Define the origins that are allowed to access the API.
origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:8000",
    "localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the path to the JSON file for persistent storage
json_file_path = "chat_collection.json"

# Create the JSON file if it doesn't exist
if not os.path.exists(json_file_path):
    with open(json_file_path, "w") as json_file:
        json.dump({}, json_file)


class UserMessage(BaseModel):
    id1: str
    id2: str
    user_id: str
    username: str
    chatid: str
    message: str
    chatmate_id: str
    chatmate_name: str
    timestamp: str
    file_path: str


@router.post("/message_collection")
async def create_message(usermessage: UserMessage):
    with open(json_file_path, "r") as json_file:
        chat_storage = json.load(json_file)

    # NOTE: This part of the code should be modified when autoreply is no
    # longer required for the project.

    key_id1 = usermessage.id1
    key_id2 = usermessage.id2
    user_id = usermessage.user_id
    user_name = usermessage.username
    chat_id = usermessage.chatid
    message_text = usermessage.message
    chatmate_id = usermessage.chatmate_id
    chatmate_name = usermessage.chatmate_name
    timestamp = usermessage.timestamp
    file_path = usermessage.file_path

    user_message = {
        "key_id": key_id1,
        "user_id": user_id,
        "username": user_name,
        "message": message_text,
        # "timestamp": datetime.now().isoformat(),
        "timestamp": timestamp,
        "filepath": file_path,
    }

    # print("User message:", user_message)

    chatmate_message = {
        "key_id": key_id2,
        "user_id": chatmate_id,
        "username": chatmate_name,
        "message": message_text,
        # "timestamp": datetime.now().isoformat(),
        "timestamp": timestamp,
        "filepath": file_path,
    }

    # print("Chatmate message:", chatmate_message)

    if user_id in chat_storage and chat_id in chat_storage[user_id]:
        # Check if the chat ID exists for the user
        if "messages" in chat_storage[user_id][chat_id]:
            # If the messages list exists, append the new message
            # Need to append the chatmate message here too:
            chat_storage[user_id][chat_id]["messages"].append(user_message)
            chat_storage[user_id][chat_id]["messages"].append(chatmate_message)
        else:
            # If the messages list doesn't exist, create it and add the new message
            chat_storage[user_id][chat_id]["messages"] = [
                user_message,
                chatmate_message,
            ]
            # Need to append the chatmate message here too:
    else:
        # Handle the case where either the user or chat doesn't exist
        return HTTPException(status_code=400, detail="User or chat not found")

    # Save chat data back to the JSON file
    with open(json_file_path, "w") as json_file:
        json.dump(chat_storage, json_file, indent=2)

    # Return the updated messages list
    return chat_storage[user_id][chat_id]["messages"]


@router.get("/message_collection")
async def read_messages(
    userid: str = Query(),
    chatid: str = Query(),
):
    with open(json_file_path, "r") as json_file:
        chat_storage = json.load(json_file)

    if userid in chat_storage and chatid in chat_storage[userid]:
        # Check if the chat ID exists for the user
        if "messages" in chat_storage[userid][chatid]:
            # If the messages list exists, return it
            return chat_storage[userid][chatid]["messages"]
        else:
            # If the messages list doesn't exist, return an empty list
            return []
    else:
        # Handle the case where either the user or chat doesn't exist
        return HTTPException(status_code=400, detail="User or chat not found")


################################################################################
# Sample json file
#
#        "0": { <--- this is user id
#             "10": { <--- this is chatid
#                 "username": "Jon",
#                 "chatmate": {"chatmatename": "Alexa", "chatmateid": "1"},
#                 "messages": [],
#             },
#             "20": {
#                 "username": "Jon",
#                 "chatmate": {"chatmatename": "Iris", "chatmateid": "2"},
#                 "messages": [],
#             },
#         },
#         "1": {
#             "10": {
#                 "username": "Alexa",
#                 "chatmate": {"chatmatename": "Jon", "chatmateid": "0"},
#                 "messages": [],
#             },
#         },
#         "2": {
#             "20": {
#                 "username": "Iris",
#                 "chatmate": {"chatmatename": "Jon", "chatmateid": "0"},
#                 "messages": [],
#             },
#         },
#     }
