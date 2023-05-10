import urllib
from datetime import datetime, timedelta

import requests
from jose import jwt
from passlib.context import CryptContext
from pymongo import MongoClient

DROPBOX_DOWNLOAD_URL = "https://content.dropboxapi.com/2/files/download"
DROPBOX_ACCESS_TOKEN = "DROPBOX_TOKEN"
DISCORD_BOT_TOKEN = "DISCORD_BOT_TOKEN"

DISCORD_API_URL = "https://discord.com/api/v9"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET_KEY = "btechproject$bm03"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_TIME_MINUTES = 30

# MongoDB Connection
client = MongoClient("MONGODB_SRV")
db = client["MIMViT"]
user_collection = db["users"]


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


async def authenticate_user(email: str, password: str):
    user = user_collection.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user


def dropbox_download(path: str, filename: str) -> None:
    dropbox_headers = {
        "Authorization": "Bearer " + DROPBOX_ACCESS_TOKEN,
        "Dropbox-API-Arg": '{"path":"' + path + '"}',
    }

    response = requests.post(DROPBOX_DOWNLOAD_URL, headers=dropbox_headers)
    if response.status_code == 200:
        with open(filename, "wb") as f:
            f.write(response.content)
    else:
        raise Exception("Failed to download video")


def discord_download(url, filename):
    headers = {"Authorization": f"Bot {DISCORD_BOT_TOKEN}"}

    # Get the message ID from the URL
    parts = url.split("/")
    print(parts)
    channel_id = parts[5]
    message_id = parts[6]

    # Make a request to the Discord API to get the message details
    message_url = f"{DISCORD_API_URL}/channels/{channel_id}/messages/{message_id}"
    response = requests.get(message_url, headers=headers)
    if not response.ok:
        raise Exception(
            f"Failed to download video from URL {url} due to {response.text}."
        )
    response = response.json()

    attachments = response.get("attachments")
    if not attachments:
        raise Exception("No attachments found in message.")

    video_url = attachments[0].get("url")
    if not video_url:
        raise Exception("No video URL found in attachments.")

    response = requests.get(video_url)
    if not response.ok:
        raise Exception(f"Failed to download video from URL {video_url}.")

    with open(filename, "wb") as f:
        f.write(response.content)
