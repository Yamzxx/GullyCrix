import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
artifact_dir = r"C:\Users\Yamini\.gemini\antigravity\brain\c4a5e638-6783-4fac-9b65-90d64719b6c2"
out_file = os.path.join(artifact_dir, "screen_chatbot_open.png")

# Start Chrome with remote debugging
user_data = r"C:\Users\Yamini\AppData\Local\Temp\chrome_shot_bot"
if os.path.exists(user_data):
    import shutil
    shutil.rmtree(user_data, ignore_errors=True)

# We can inject a small script to click the bot button:
# In index.html, if ?openbot=1, document.querySelector('button[title="Gully AI Cricket Assistant"]').click()
print("Preparing to test chatbot open...")
