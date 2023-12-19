# api/chat_collection.py
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


class LastMessage(BaseModel):
    message: Optional[str] = ""
    timestamp: Optional[datetime] = None


class ChatbotInfo(BaseModel):
    chatbot: str
    chatbotid: str


class Message(BaseModel):
    user_id: str
    message: Optional[str] = ""
    timestamp: Optional[datetime] = None


class Chat(BaseModel):
    chatid: str
    messages: List[Message]


class UserChat(BaseModel):
    user_id: str
    currentuser: str
    chatid: str
    chatbot: str
    chatbotid: str


@router.post("/chat_collection", response_model=UserChat)
async def create_userchat(userchat: UserChat):
    with open(json_file_path, "r") as json_file:
        chat_storage = json.load(json_file)

    # Check if user_id already has the chatid
    if (
        str(userchat.user_id) in chat_storage
        and str(userchat.chatid) in chat_storage[str(userchat.user_id)]
    ):
        # If chatid exists, return the user chat
        return chat_storage[str(userchat.user_id)][str(userchat.chatid)]

    # Create new chat box if user_id exists but chatid is not in user chat
    if userchat.user_id in chat_storage:
        chat_storage[str(userchat.user_id)][str(userchat.chatid)] = {
            "user": {
                "username": userchat.currentuser,
                "userid": userchat.user_id,
            },
            "chatmate": {
                "chatmatename": userchat.chatbot,
                "chatmateid": userchat.chatbotid,
            },
            "messages": [],  # collection of messages
        }
    else:
        # Create a new user entry and chat box if user_id doesn't exist
        chat_storage[userchat.user_id] = {
            userchat.chatid: {
                "user": {
                    "username": userchat.currentuser,
                    "userid": userchat.user_id,
                },
                "chatmate": {
                    "chatmatename": userchat.chatbot,
                    "chatmateid": userchat.chatbotid,
                },
                "messages": [],  # collection of messages
            }
        }

    # Save chat data back to the JSON file
    with open(json_file_path, "w") as json_file:
        json.dump(chat_storage, json_file, indent=2)

    return userchat


@router.get("/chat_collection")
async def read_chat(
    userid: str = Query(),
    chatid: str = Query(None),
):
    # Load existing chat data from the JSON file
    with open(json_file_path, "r") as json_file:
        chat_storage = json.load(json_file)

    # Retrieve the chat data for the user
    user_chats = chat_storage[userid]
    # print("user chats", user_chats)

    return user_chats


# @router.get("/chat_collection", response_model=List[str])
# async def list_chats():
#     # Load existing chat data from the JSON file
#     with open(json_file_path, "r") as json_file:
#         chat_storage = json.load(json_file)

#     # Return a list of chat IDs
#     return list(chat_storage.keys())


################################################################################
# Sample json file
#
#        "0": {
#             "10": {
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
#
#
#  This is the structure of the chat_collection.json
#        {
#          userid: {
#              chatid: {
#                  username: currentuser,
#                  chatmatename: chatbot,
#                  chatmateid: chatbotid,
#                  messsages: [], # Collection of messages
#                  }
#                }
#        }
#
