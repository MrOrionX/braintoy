# api/current_user.py
from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()
router = APIRouter()

# Define the origins that are allowed to access my API.
origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Define a path to the JSON file
json_file_path = "users.json"

# Read the existing user data from users.json
with open(json_file_path, "r") as json_file:
    users_data = json.load(json_file)


@router.get("/current_user")
async def get_current_user(
    username: str = Query(),
):
    # Check if the user exists
    user_exists = next(
        (u for u in users_data if u.get("username").lower() == username.lower()), None
    )

    if user_exists and user_exists.get("username") is not None:
        return {
            "username": user_exists["username"],
            "uid": user_exists.get("uid", None),
        }
    else:
        return {"detail": "User not found"}
