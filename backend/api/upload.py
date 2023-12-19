from fastapi import FastAPI, APIRouter, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import List

app = FastAPI()
upload = APIRouter()

# Create the "uploads" directory if it doesn't exist
uploads_directory = Path("uploads")
uploads_directory.mkdir(parents=True, exist_ok=True)

# Create static files to allow frontend access to the files
app.mount("/uploads", StaticFiles(directory=uploads_directory), name="uploads")


# Type of files allowed to be uploaded
def is_allowed_file(filename):
    allowed_extensions = {"pdf", "csv", "doc", "docx", "txt"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions


@upload.post("/upload_files/")
async def upload_files(files: List[UploadFile] = Form(...), chatid: str = Form(...)):
    file_paths = []

    for uploaded_file in files:
        if not is_allowed_file(uploaded_file.filename):
            return JSONResponse(
                content={"error": "File type not allowed!"}, status_code=400
            )

        file_path = uploads_directory / f"{chatid}" / f"{uploaded_file.filename}"

        # Checks if file already exists in the chat subfolder
        if file_path.is_file():
            return JSONResponse(
                content={
                    "error": "File exists!",
                    "detail": "File already exists in the chat folder.",
                },
                status_code=400,
            )

        # Create the subdirectory if it doesn't exist
        file_path.parent.mkdir(parents=True, exist_ok=True)

        with file_path.open("wb") as buffer:
            buffer.write(uploaded_file.file.read())

        file_paths.append(str(file_path))

    return JSONResponse(content={"file_paths": file_paths})
