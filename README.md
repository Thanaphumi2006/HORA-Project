# HORA — Predicting ur Destiny

HORA is a browser-based astrology and tarot reading web app. Enter your name and birthday to receive a daily horoscope prediction and a tarot card reading based on your zodiac sign.

---

## Quick Start (For Everyone)

### Step 1 — Download the project

1. Go to [https://github.com/Thanaphumi2006/HORA-Project](https://github.com/Thanaphumi2006/HORA-Project)
2. Click the green **Code** button → **Download ZIP**
3. Extract (unzip) the folder anywhere on your computer

---

### Step 2 — Install Python (only needed once)

HORA uses a small Python script to open the app in your browser. Python is free and takes ~1 minute to install.

| Your System | Download Link |
|-------------|---------------|
| Windows | [python.org/downloads](https://www.python.org/downloads/) |
| macOS | [python.org/downloads](https://www.python.org/downloads/) or run `brew install python3` |
| Linux | Run `sudo apt install python3` in your terminal |

> **Windows users:** During installation, check the box that says **"Add Python to PATH"**

To check if Python is already installed, open a terminal and type:
```
python --version
```
If you see a version number, you are ready.

---

### Step 3 — Launch the app

| Your System | What to do |
|-------------|------------|
| **Windows** | Double-click `start.bat` |
| **macOS / Linux** | Open Terminal in the folder, run `bash start.sh` |
| **Any system** | Open Terminal/Command Prompt in the folder, run `python start.py` |

The app will automatically open in your browser at `http://localhost:8080`.

---

## How to Use the App

1. **Loading Screen** — Click anywhere or press any key to continue
2. **Sign In** — Enter any email and password, then click **Sign In**
3. **Enter Your Name** — Type your name and press Next
4. **Enter Your Birthday** — Select your birth day, month, and year
5. **Choose a Focus** — Pick an area of life (Love, Career, etc.)
6. **Home Page** — Two cards appear:
   - **Today Prediction** — Your daily horoscope based on your zodiac sign
   - **Tarot Reading** — Your zodiac's ruling tarot card
7. **Click either card** to explore deeper readings

---

## Stopping the App

Press **Ctrl+C** in the terminal window to stop the server.

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Loading screen + Sign In |
| `name.html` | Enter your name |
| `birthday.html` | Enter your birthday |
| `focus.html` | Choose your focus area |
| `home.html` | Main dashboard (horoscope + tarot) |
| `predict.html` | Detailed daily prediction |
| `question.html` | Ask a question |
| `tarot.html` | Tarot card selection |
| `tarotresult.html` | Tarot card result |

---

## Notes

- No account or sign-up is required — any email/password works on the login screen
- Works best on **Google Chrome**, **Firefox**, or **Edge**
- An internet connection improves predictions with live horoscope data, but the app works offline too

---

*HORA is intended for entertainment purposes only and does not constitute professional advice of any kind.*
