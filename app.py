from datetime import timedelta, datetime
from pathlib import Path

import torch
from bson import ObjectId
from fastapi import FastAPI, Response, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from pydantic import BaseModel

from model import OurModel
from preprocessing import extract_preprocessed_frames
from multiface_preprocessing import extract_preprocessed_frames_multiface
from utils import (
    discord_download,
    dropbox_download,
    hash_password,
    authenticate_user,
    create_access_token,
    JWT_EXPIRATION_TIME_MINUTES,
    user_collection,
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
)

# Model init
BASE_DIR = Path(__file__).resolve(strict=True).parent
device = torch.device("cpu")
model = OurModel(
    (224, 224, 3), num_features=2048, drop_rate=0.4, num_classes=1, training=False
)
model = model.to(device)
model.load_state_dict(
    torch.load(f"{BASE_DIR}/mimvit-weights.pt", map_location=device), strict=False
)


# Request and Response Schemas
class VideoRequest(BaseModel):
    path: str


class LoginRequest(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    email: str
    channel_name: str
    password: str


class Video(BaseModel):
    video_title: str
    thumbnail: str
    URL: str
    IST_date: datetime
    MIM_VIT_score: str


# FastAPI Init
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
@app.post("/detect-deepfake")
async def detect_deepfake(req: VideoRequest, res: Response):
    downloaded_filename = "tmp.mp4"
    print(req.path)
    try:
        if "discord" in req.path:
            discord_download(req.path, downloaded_filename)
        else:
            dropbox_download(req.path, downloaded_filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)

    result = {"label": None, "score": None}
    with torch.no_grad():
        model.eval()
        frames = extract_preprocessed_frames(downloaded_filename)
        frames = frames.to(device)
        output = model(frames)
        pred_label = torch.mean(output, 1, True)
        if pred_label[0] <= 0.45:
            result["label"] = "Real"
            result["score"] = 1 - pred_label.item()
        else:
            result["label"] = "Fake"
            result["score"] = pred_label.item()
    return {"result": result}


@app.post("/detect-deepfake-multiface")
async def detect_deepfake(req: VideoRequest, res: Response):
    downloaded_filename = "tmp.mp4"
    print(req.path)
    try:
        if "discord" in req.path:
            discord_download(req.path, downloaded_filename)
        else:
            dropbox_download(req.path, downloaded_filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)

    result = {"label": None, "score": None}
    with torch.no_grad():
        model.eval()
        frames = extract_preprocessed_frames_multiface(downloaded_filename)
        frames = frames.to(device)
        split_tensor = torch.split(frames, 1, 0)
        outputs = []
        for i, t in enumerate(split_tensor):
            outputs.append(model(t))
        outputs = torch.cat(outputs, dim=0)
        logits = torch.mean(outputs, 1, False)
        pred_label = torch.any(logits[:, :] > 0.45)
        score, _ = torch.max(logits, dim=0)
        if pred_label:
            result["label"] = "Fake"
            result["score"] = score.item()
        else:
            result["label"] = "Real"
            result["score"] = 1.00 - score.item()
    return {"result": result}


@app.post("/register")
async def register(user_create: UserCreate):
    hashed_password = hash_password(user_create.password)
    user = {
        "email": user_create.email,
        "channel_name": user_create.channel_name,
        "password": hashed_password,
        "videos": [],
    }
    result = user_collection.insert_one(user)
    return {"id": str(result.inserted_id)}


@app.post("/login")
async def login(login_request: LoginRequest):
    user = await authenticate_user(login_request.email, login_request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=timedelta(minutes=JWT_EXPIRATION_TIME_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/add_video")
async def add_video(
    video: Video,
    vit_api_authtoken: str = Header(None),
):
    try:
        token = str.replace(vit_api_authtoken, "Bearer ", "")
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload["sub"]
        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid user")

        video_dict = video.dict()
        user_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$push": {"videos": video_dict}}
        )
        return {"message": "Video added successfully"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/get_videos")
async def get_videos(
    vit_api_authtoken: str = Header(None),
):
    try:
        token = str.replace(vit_api_authtoken, "Bearer ", "")
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload["sub"]
        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid user")

        return {"videos": user["videos"]}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/verify_token")
async def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise JWTError("Invalid token")
    except JWTError as e:
        return {"message": e}

    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return {"message": "User does not exist"}

    return {"message": "Success"}
