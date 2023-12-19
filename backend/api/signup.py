# api/signup.py
from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
router = APIRouter()

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

users_file_path = "users.json"
counter_file_path = "uid_counter.json"
users_chat_path = "chat_collection.json"

# Create the JSON file if it doesn't exist
if not os.path.exists(users_file_path):
    with open(users_file_path, "w") as json_file:
        json.dump([], json_file)

# Create the chat collection if it doesn't exist
if not os.path.exists(users_chat_path):
    with open(users_chat_path, "w") as json_file:
        json.dump({}, json_file)

# Create the counter file if it doesn't exist
if not os.path.exists(counter_file_path):
    with open(counter_file_path, "w") as counter_file:
        counter_file.write("0")


class User(BaseModel):
    uid: str
    username: str
    email: str
    password: str


@router.post("/signup", response_model=User)
async def create_user(user: User):
    # Read existing counter value
    with open(counter_file_path, "r") as counter_file:
        counter_value = int(counter_file.read())

    # Generate a new uid using the counter value
    user.uid = str(counter_value)

    # Increment the counter value
    counter_value += 1

    # Write updated counter value back to the file
    with open(counter_file_path, "w") as counter_file:
        counter_file.write(str(counter_value))

    # Read existing user data from users.json
    with open(users_file_path, "r") as json_file:
        users_data = json.load(json_file)

    # Check if the user already exists
    if any(u["username"] == user.username for u in users_data):
        raise HTTPException(status_code=400, detail="User already exists")

    # If users_data is a dictionary, initialize it as an empty list
    if not isinstance(users_data, list):
        users_data = []

    # Append the new user data
    users_data.append(user.dict())

    # Write updated user data back to users.json
    with open(users_file_path, "w") as json_file:
        json.dump(users_data, json_file, indent=4)

    # Read existing chat data from chat_collection.json
    with open(users_chat_path, "r") as json_file:
        chat_data = json.load(json_file)

    # Append the new registered user id to the chat_collection
    chat_data[user.uid] = {}

    # Write updated chat data back to chat_collection.json
    with open(users_chat_path, "w") as json_file:
        json.dump(chat_data, json_file, indent=4)

    return user
