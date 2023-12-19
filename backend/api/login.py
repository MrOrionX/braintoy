# api/login.py
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from pydantic import BaseModel
import json
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
router = APIRouter()

# Define the origins that are allowed to access my API.
origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a path to the JSON file
json_file_path = "users.json"


# Helper function to verify user credentials
def verify_user(email, password):
    with open(json_file_path, "r") as json_file:
        users_data = json.load(json_file)

    for user in users_data:
        if user["email"] == email and user["password"] == password:
            return {
                "username": user["username"],
                "uid": user.get("uid"),
            }  # Return the username and UID
    return None


# Helper function to read users data
def read_users_data():
    with open(json_file_path, "r") as json_file:
        users_data = json.load(json_file)
    return users_data


# Request model for user login
class UserLogin(BaseModel):
    email: str
    password: str


# Create a new endpoint for user login
@router.post("/login")
async def user_login(user: UserLogin, users_data: list = Depends(read_users_data)):
    user_info = verify_user(user.email, user.password)
    if user_info:
        return {
            "message": "Login successful",
            "username": user_info["username"],
            "uid": user_info.get("uid"),
        }
    else:
        raise HTTPException(status_code=401, detail="Login failed")
