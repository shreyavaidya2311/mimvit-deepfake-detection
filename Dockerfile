FROM python:3.8.10

WORKDIR /deepfake-api

COPY ./requirements.txt /deepfake-api/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /deepfake-api/requirements.txt

COPY . /deepfake-api/

RUN apt update

RUN apt install -y libgl1-mesa-glx

CMD ["uvicorn", "app:app", "--host=0.0.0.0", "--port=8000"]