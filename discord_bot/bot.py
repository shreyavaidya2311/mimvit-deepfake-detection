import asyncio

import aiohttp
import discord

BOT_TOKEN = "DISCORD_BOT_TOKEN"

intents = discord.Intents.default()
intents.messages = True
intents.message_content = True

# Set up the Discord bot client
client = discord.Client(intents=intents)

# Set up the FastAPI endpoint URL
endpoint_url = "http://localhost:8000/detect-deepfake/"


# Define a function to check if a message contains a video attachment
def is_video_message(message):
    print(message.attachments)
    return message.attachments and any(
        attachment.content_type.startswith("video")
        for attachment in message.attachments
    )


# Define an event handler for when the bot is ready
@client.event
async def on_ready():
    print(f"Logged in as {client.user} (ID: {client.user.id})")


async def get_result(session, message_link):
    async with session.post(endpoint_url, json={"path": message_link}) as response:
        if response.status == 200:
            result = await response.json()
            return result.get("result")
        else:
            return None


async def handle_message(message):
    # Check if the message contains a video attachment
    if is_video_message(message):
        # Get the message link
        message_link = f"https://discord.com/channels/{message.guild.id}/{message.channel.id}/{message.id}"
        print(f"Detected video message: {message_link}")
        # Make an API call to the FastAPI endpoint with the message link
        async with aiohttp.ClientSession() as session:
            result = await get_result(session, message_link)

        if result is not None:
            label = result["label"]
            score = result["score"]
            score = "{:.2%}".format(score)
            score = score[:-1]
            if label == "Fake":
                msg = f"❗**Deepfake Video Detected**❗\n\nThe video sent by {message.author.mention} has been flagged as **FAKE**.\n\n*Probability Score: **{score} / 100***"
                await message.channel.send(msg)
            print("API call successful")
        else:
            print("API call failed")


# Define an event handler for when a message is sent
@client.event
async def on_message(message):
    asyncio.create_task(handle_message(message))


# Start the Discord bot client
client.run(BOT_TOKEN)
