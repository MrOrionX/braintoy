from fastapi import FastAPI, Body, Request, Form
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# api to be developed
from api.generate_response import generate_response_v1
from api.upload import upload
from api.login import router as login_router
from api.signup import router as signup_router
from api.current_user import router as current_user_router
from api.chat_collection import router as chat_collection_router
from api.server_reload import router as server_reload_router
from api.message_collection import router as message_collection_router


app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000"]

# Configures CORSMiddleware for a FastAPI application.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Replace with the actual origin of your frontend
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
    ],  # You can specify specific HTTP methods (e.g., ["GET", "POST"])
    allow_headers=["*"],  # You can specify specific headers if needed
)

app.include_router(generate_response_v1, prefix="/api/v1")
app.include_router(upload, prefix="/api")
app.include_router(login_router, prefix="/api")
app.include_router(signup_router, prefix="/api")
app.include_router(current_user_router, prefix="/api")
app.include_router(chat_collection_router, prefix="/api")
app.include_router(server_reload_router, prefix="/api")
app.include_router(message_collection_router, prefix="/api")


@app.get("/")
async def get_root():
    return {"message": "Hello from FastAPI!"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)  # , reload=True
