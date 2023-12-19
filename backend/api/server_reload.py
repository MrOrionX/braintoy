# server_reload.py
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import sys

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

counter_file_path = "counter.py"


def read_counter():
    try:
        with open(counter_file_path, "r") as file:
            data = json.load(file)
            return data["counter"]
    except FileNotFoundError:
        return 0


def write_counter(counter):
    with open(counter_file_path, "w") as file:
        json.dump({"counter": counter}, file)


@router.get("/get_counter")
def get_counter():
    counter = read_counter()
    return {"counter": counter}


@router.post("/server_reload")
def increment_counter():
    counter = read_counter()
    counter += 1
    write_counter(counter)

    # Reload the module to update the variable in-memory
    try:
        importlib.reload(sys.modules[__name__])
    except NameError:
        import importlib

        importlib.reload(sys.modules[__name__])

    return {"counter": counter}
