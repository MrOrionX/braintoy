from fastapi import FastAPI, APIRouter, HTTPException

generate_response_v1 = APIRouter()

"""Example"""
@generate_response_v1.get('/')
async def hello():
    return {"message": "Hello world"}

# @generate_response_v1.post("/post_string/")
# async def post_string(input_string: str):
#     return {"received_string": input_string}

"""Example"""
@generate_response_v1.get("/get-random-response/")
async def get_random_response(input_text: str):
    return {"response": f"You provided the following input: {input_text}"}