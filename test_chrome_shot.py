import subprocess
import os

cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--disable-gpu",
    "--window-size=1280,720",
    "--user-data-dir=C:\\Users\\Yamini\\AppData\\Local\\Temp\\chrome_test_3",
    r"--screenshot=C:\Users\Yamini\.gemini\antigravity\brain\c4a5e638-6783-4fac-9b65-90d64719b6c2\screen_matches.png",
    "http://localhost:5000/matches?nosplash=1"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Returncode:", res.returncode)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)
print("File exists:", os.path.exists(r"C:\Users\Yamini\.gemini\antigravity\brain\c4a5e638-6783-4fac-9b65-90d64719b6c2\screen_matches.png"))

