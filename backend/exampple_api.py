from fastapi import FastAPI, Body, Request, Form
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000"]

# Configures CORSMiddleware for a FastAPI application.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Replace with the actual origin of your frontend
    allow_credentials=True,
    allow_methods=[
        "*"
    ],  # You can specify specific HTTP methods (e.g., ["GET", "POST"])
    allow_headers=["*"],  # You can specify specific headers if needed
)


@app.get("/")
async def get_root():
    return {"message": "Hello from FastAPI!"}


# @app.post("/")
# async def create_message(message: str = Body(...)):
#   return {"message": message}


@app.post("/post_string/")
async def post_string(input_string):
    print("input_string", input_string)
    return {"received_string": input_string}


@app.post("/api/submit")
async def submit_data(data: str = Form(...)):
    return {"message": f"Received data: {data}"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)  # , reload=True
