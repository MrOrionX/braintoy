from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from authlib.integrations.starlette_client import OAuthError
from starlette.config import Config
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
import httpx

config = Config(".env")
app = FastAPI()

# Define your Microsoft application credentials
MICROSOFT_CLIENT_ID = config("MICROSOFT_CLIENT_ID")
MICROSOFT_CLIENT_SECRET = config("MICROSOFT_CLIENT_SECRET")
MICROSOFT_REDIRECT_URI = config("MICROSOFT_REDIRECT_URI")
MICROSOFT_AUTHORIZATION_URL = (
    "https://login.microsoftonline.com/common/oauth2/authorize"
)
MICROSOFT_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/token"

# Configure OAuth2 with Microsoft
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=MICROSOFT_AUTHORIZATION_URL,
    tokenUrl=MICROSOFT_TOKEN_URL,
    clientId=MICROSOFT_CLIENT_ID,
    clientSecret=MICROSOFT_CLIENT_SECRET,
    redirectUri=MICROSOFT_REDIRECT_URI,
)

# Add session middleware for storing the OAuth2 token
app.add_middleware(SessionMiddleware, secret_key="your_secret_key")


# Dependency to get the current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    return token


# OAuth2 login route
@app.get("/login")
async def login(request: Request):
    return await oauth2_scheme.authorize_redirect(request, MICROSOFT_REDIRECT_URI)


# OAuth2 callback route
@app.get("/login/callback")
async def login_callback(request: Request, token: str = Depends(oauth2_scheme)):
    # Store the token in the session for future use
    request.session["token"] = token
    return {"message": "Login successful"}


# Protected route that requires authentication
@app.get("/protected")
async def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": "You are authenticated", "user": current_user}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
