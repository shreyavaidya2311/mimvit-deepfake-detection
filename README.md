## MIM-ViT: Deepfake Detection using Masked Image Modelling and Vision Transformer

### Introduction
<div align="justify">
The term “deepfake” is derived from the words “deep learning” and “fake”. Deepfakes are synthetic media that use deep learning to manipulate or replace the original content of an image, audio, or video file to create a new version that appears to be authentic. The number of deepfake videos has been multiplying rapidly in the past 5 years. The alarming rate of growth of deepfakes is a major cause of concern. Deepfake detection is important for several reasons:
</div>

- *Preventing Spread of Misinformation*

- *Protecting Personal Privacy*

- *Ensuring Digital Trust*

<div align="justify">
This work proposes a deep learning based approach to the above-stated problem statement which addresses three major research gaps, Multi-face Deepfake Detection, Face Quality Detection and Convergence with less data. The solution consists of two sub-models working in parallel, namely the Multiscale Vision Transformer and the Masked Autoencoder, ConvNeXt. A novel facial quality detection algorithm is developed, which helps improve the data quality by overcoming the challenge of misrepresented facial data.
</div>

<hr/>

### Proposed Model

<img src="https://github.com/shreyavaidya2311/mimvit-deepfake-detection/assets/56782318/c2ef0888-9d67-4e96-9ff3-4c9068793d4a"/>

<hr/>

### Multi-face Deepfake Detection

<img src="https://github.com/shreyavaidya2311/mimvit-deepfake-detection/assets/56782318/2353f329-94b0-43bc-ae3c-ccb0bb864462"/>

<hr/>

### Applications - VStream

<div align="justify">
VStream is a video streaming application designed to provide users with an authentic and secure experience by ensuring that only real videos are uploaded and displayed on the platform. The application allows users to upload and watch videos, with a focus on ensuring the authenticity of the content. VStream utilizes the proposed model MIM-ViT to detect deepfake videos and prevents them from being shared.
 </div>

#### Product Functions

- *Video Upload*

- *Video Viewing*

- *Deepfake Detection*

- *User Profiles*

- *Search Functionality*

#### Tech Stack

<img width="450px" src="https://github.com/shreyavaidya2311/mimvit-deepfake-detection/assets/56782318/4006fe24-3211-4619-9ef8-3024b25ed4a2"/>

#### Working Application

![](https://github.com/shreyavaidya2311/mimvit-deepfake-detection/assets/56782318/d2b0ebcd-2480-4dd0-b297-159b70cc8bb0)

![](https://github.com/shreyavaidya2311/mimvit-deepfake-detection/assets/56782318/1e753bb1-fde6-43cf-b0ed-7b0b72e2f904)

<hr/>

### Applications - Deepfake Detector Discord Bot

The Deepfake Detector bot is designed to operate within a Discord server and monitor messages containing videos to identify and flag any videos that may contain deepfake content.

#### Functional Requirements

- *User Registration and Authentication*

- *Monitoring Messages*

- *Deepfake Detection*

- *Flagging Deepfakes*

#### Non-Functional Requirements

- *Performance*

- *Security*

- *Compatibility*

#### Tech Stack

<img width="450px" src="https://github.com/shreyavaidya2311/mimvit-deepfake-detection/assets/56782318/4da7e046-0039-489c-87d9-beefa3569556"/>

#### Working Application

![](https://github.com/shreyavaidya2311/mimvit-deepfake-detection/assets/56782318/573cdd47-83f4-4997-b9dc-c036c1e0c8c6)

<hr/>

### Installation

1. Clone the repository
    ```
    git clone https://github.com/shreyavaidya2311/mimvit-deepfake-detection.git
    ```

2. API Keys

    | Command           | Link                                                      |
    | ---               | ---                                                       |
    | Youtube API       | [Link](https://developers.google.com/youtube/v3)          |
    | Discord Bot Token | [Link](https://discord.com/developers/docs/topics/oauth2) |
    | Dropbox API       | [Link](https://www.dropbox.com/developers)                |

    Replace DISCORD_BOT_TOKEN, DROPBOX_TOKEN and YOUTUBE_API_KEY in the code with your keys


3. Frontend Dependencies
    ```
    cd frontend && npm i
    ```

4. Backend Dependencies
    ```
    pip install -r requirements.txt
    pip install discord.py
    ```

5. Run the frontend (http://localhost:3000/)
    ```
    cd frontend && npm start
    ```

6. Run the backend (http://localhost:8000/)
    ```
    uvicorn app:app --host=0.0.0.0 --port=8000
    ```

7. Run the Discord Bot

    *Before running the bot, create a bot on the Discord Developer Console and add it to your server. Paste the bot token in `bot.py`*
    
    ```
    python3 bot.py
    ```

<hr/>

### Contributors

- <a href="https://www.linkedin.com/in/shreya-vaidya/">Shreya Vaidya</a>

- <a href="https://www.linkedin.com/in/sameer-kavthekar/">Sameer Kavthekar</a>

- <a href="https://www.linkedin.com/in/vishwesh-pujari-7205391b6/">Vishwesh Pujari</a>



