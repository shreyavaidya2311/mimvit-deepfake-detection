import cv2
import filetype
from PIL import Image
from retinaface import RetinaFace
import numpy as np
import albumentations as A
from albumentations.pytorch import ToTensorV2
import torch

scale = 1.25
NUM_FRAMES = 32

test_transform = A.Compose(
    [
        A.Resize(224, 224),
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ToTensorV2(),
    ]
)


def extract_preprocessed_frames(video_path):
    images = []
    kind = filetype.guess(video_path)
    if kind is None:
        return
    if kind.mime.startswith("video"):
        video = cv2.VideoCapture(video_path)
        frames = video.get(cv2.CAP_PROP_FRAME_COUNT)
        frames_to_be_considered_count = 0
        np.random.seed(None)
        frames_to_be_considered = sorted(
            np.random.choice(int(frames), NUM_FRAMES, replace=False)
        )

    for i in range(0, frames_to_be_considered[-1] + 1):
        if i != frames_to_be_considered[frames_to_be_considered_count]:
            frame = video.grab()
            continue
        success, frame = video.read()
        if success:
            w = frame.shape[1]
            h = frame.shape[0]
            greater_side = max(w, h)
            if greater_side < 300:
                frame = cv2.resize(frame, (0, 0), fx=2, fy=2)
            elif greater_side > 1000:
                frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
            elif greater_side > 1900:
                frame = cv2.resize(frame, (0, 0), fx=0.33, fy=0.33)
            image = {"file": frame, "source": video_path, "sourceType": "video"}
            images.append(image)
            frames_to_be_considered_count += 1
        else:
            break
    video.release()

    preprocessed_frames = []

    for (i, image) in enumerate(images):
        results = RetinaFace.detect_faces(image["file"])

        array = cv2.cvtColor(image["file"], cv2.COLOR_BGR2RGB)
        img = Image.fromarray(array)

        if type(results) != dict:
            continue

        for key, face in results.items():
            (startX, startY, endX, endY) = face["facial_area"]
            bW = endX - startX
            bH = endY - startY
            centerX = startX + (bW / 2.0)
            centerY = startY + (bH / 2.0)
            left = centerX - bW / 2.0 * scale
            top = centerY - bH / 2.0 * scale
            right = centerX + bW / 2.0 * scale
            bottom = centerY + bH / 2.0 * scale
            face = img.crop((left, top, right, bottom))
            fW, fH = face.size

            if fW < 10 or fH < 10:
                continue

            face = np.array(face)
            preprocessed_face = test_transform(image=face)
            preprocessed_frames.append(preprocessed_face["image"])

    preprocessed_frames = torch.stack(preprocessed_frames)
    preprocessed_frames = preprocessed_frames.unsqueeze(0)
    return preprocessed_frames
