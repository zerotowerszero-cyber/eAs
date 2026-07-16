import discord
from discord.ext import commands
from discord import app_commands
import os
import random
import string
import requests
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")
# The user specified ID
ALLOWED_USER_ID = 847175065027608646
API_URL = os.getenv("NEXTJS_API_URL", "http://localhost:3000/api/internal/generate-invite")
INTERNAL_SECRET = os.getenv("INTERNAL_BOT_SECRET", "eas-cx-internal-secret-2026")
BASE_URL = os.getenv("NEXTJS_BASE_URL", "http://localhost:3000")

class EASBot(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        await self.tree.sync()

client = EASBot()

@client.event
async def on_ready():
    print(f'Logged in as {client.user} (ID: {client.user.id})')
    # Set status as requested
    activity = discord.Activity(type=discord.ActivityType.watching, name="https://eas.cx")
    await client.change_presence(activity=activity)

def generate_random_string(length: int) -> string:
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

@client.tree.command(name="generate-code", description="Generate a secure 10-digit code and invite link")
async def generate_code(interaction: discord.Interaction):
    # Check if the user is authorized
    if interaction.user.id != ALLOWED_USER_ID:
        await interaction.response.send_message("You are not authorized to use this command.", ephemeral=True)
        return

    # Defer response since API call might take a moment
    await interaction.response.defer(ephemeral=True)

    # Generate codes
    invite_token = generate_random_string(20)
    auth_code = generate_random_string(10)

    # Send to Next.js Internal API
    try:
        response = requests.post(
            API_URL,
            json={"token": invite_token, "code": auth_code},
            headers={"Authorization": f"Bearer {INTERNAL_SECRET}"}
        )
        
        if response.status_code == 200:
            invite_link = f"{BASE_URL}/auth/{invite_token}"
            
            # Simple text response as requested (no emojis, colors, minimalistic)
            msg = (
                f"Your generated access link:\n{invite_link}\n\n"
                f"When visited, the user's IP will be permanently bound to this 10-digit code:\n{auth_code}\n\n"
                f"Ensure the user visits the link from the exact device and network they intend to use."
            )
            
            # Send DM as requested
            try:
                await interaction.user.send(msg)
                await interaction.followup.send("Link and code have been sent to your DMs.", ephemeral=True)
            except discord.Forbidden:
                await interaction.followup.send("I cannot DM you. Please enable DMs from server members.", ephemeral=True)
                
        else:
            await interaction.followup.send(f"Failed to generate code in database. API responded with: {response.status_code}", ephemeral=True)
    
    except Exception as e:
        await interaction.followup.send(f"An error occurred connecting to the backend: {str(e)}", ephemeral=True)

if __name__ == '__main__':
    if not TOKEN:
        print("Please set DISCORD_TOKEN in the environment or .env file.")
    else:
        client.run(TOKEN)
