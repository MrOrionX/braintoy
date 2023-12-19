# login.py

from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2AuthorizationCodeBearer, OAuth2PasswordBearer
from pydantic import BaseModel
from dotenv import load_dotenv
import json
import os

load_dotenv()

# Load environment variables from the .env file
# Need to acquire Azure account credentials first user your SAIT account
MICROSOFT_CLIENT_ID = os.getenv("MICROSOFT_CLIENT_ID")
MICROSOFT_CLIENT_SECRET = os.getenv("MICROSOFT_CLIENT_SECRET")
MICROSOFT_REDIRECT_URI = os.getenv("MICROSOFT_REDIRECT_URI")
MICROSOFT_AUTHORIZATION_URL = os.getenv("MICROSOFT_AUTHORIZATION_URL")
MICROSOFT_TOKEN_URL = os.getenv("MICROSOFT_TOKEN_URL")

app = FastAPI()
router = APIRouter()

# Define the origins that are allowed to access the API.
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


# OAuth2 with Password flow for email/password login
oauth2_password_scheme = OAuth2PasswordBearer(tokenUrl="token")

# OAuth2 with Authorization Code flow for Microsoft login
oauth2_microsoft_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=MICROSOFT_AUTHORIZATION_URL,
    tokenUrl=MICROSOFT_TOKEN_URL,
    clientId=MICROSOFT_CLIENT_ID,
    clientSecret=MICROSOFT_CLIENT_SECRET,
    redirectUri=MICROSOFT_REDIRECT_URI,
)


# Request model for user login
class UserLogin(BaseModel):
    email: str
    password: str


# Create a new endpoint for user login
@router.post("/login")
async def user_login(
    user: UserLogin,
    users_data: list = Depends(read_users_data),
    email_password_token: str = Depends(oauth2_password_scheme),
    microsoft_token: str = Depends(oauth2_microsoft_scheme),
):
    # Check if the user is using OAuth2 with Microsoft authentication
    if microsoft_token:
        # Add Microsoft authentication logic here
        # You can retrieve user information from Microsoft using the token
        # If verified my microsoft, the user needs to be added to the users.json database
        return {"message": "Microsoft OAuth2 login successful"}

    # If not, proceed with email and password authentication
    user_info = verify_user(user.email, user.password)
    if user_info:
        return {
            "message": "Email/Password login successful",
            "username": user_info["username"],
            "uid": user_info.get("uid"),
        }
    else:
        raise HTTPException(status_code=401, detail="Login failed")


# Include the router in the main FastAPI app
app.include_router(router)
