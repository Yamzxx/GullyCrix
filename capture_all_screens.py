import subprocess
import os
import shutil

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
artifact_dir = r"C:\Users\Yamini\.gemini\antigravity\brain\c4a5e638-6783-4fac-9b65-90d64719b6c2"

pages = [
    ("matches", "http://localhost:5000/matches?nosplash=1"),
    ("stats", "http://localhost:5000/stats?nosplash=1"),
    ("profile", "http://localhost:5000/profile?nosplash=1"),
    ("home", "http://localhost:5000/?nosplash=1")
]

for name, url in pages:
    user_data = f"C:\\Users\\Yamini\\AppData\\Local\\Temp\\chrome_shot_{name}"
    if os.path.exists(user_data):
        shutil.rmtree(user_data, ignore_errors=True)
    out_file = os.path.join(artifact_dir, f"screen_{name}.png")
    if os.path.exists(out_file):
        os.remove(out_file)

    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--window-size=1280,720",
        f"--user-data-dir={user_data}",
        f"--screenshot={out_file}",
        url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"Captured {name}: returncode={res.returncode}, file_exists={os.path.exists(out_file)}")

