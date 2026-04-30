# HORA — Predicting ur Destiny

HORA is a React-based astrology and tarot reading web app. Enter your name and birthday to receive a daily horoscope prediction and a tarot card reading based on your zodiac sign.

## Live App

**https://thanaphumi2006.github.io/HORA-Project/**

No download or installation needed — just open the link in your browser.

---

## Tech Stack

- **React 18** + **React Router** (HashRouter for static-host friendly routing)
- **Vite** for build + dev server
- **EmailJS** for emailing predictions/tarot results
- Static deploy via **GitHub Actions → GitHub Pages**

---

## Run Locally

You need **Node.js 18+** ([nodejs.org](https://nodejs.org)).

```bash
npm install
npm run dev
```

The dev server opens at `http://localhost:8080`.

To build a production bundle:

```bash
npm run build
npm run preview   # serve the production bundle locally
```

---

## Project Structure

```
src/
├── main.jsx            # React entry, sets up HashRouter
├── App.jsx             # Routes
├── styles.css          # Global font, transitions, reset
├── lib/
│   ├── zodiac.js          # getZodiac, lifePathNumber
│   ├── horoscope.js       # zodiacFocusPredictions, lpnColors
│   ├── tarot.js           # full deck data + helpers
│   ├── email.js           # EmailJS wrapper + log helpers
│   └── useFadeNavigate.js # page-out fade hook
└── pages/
    ├── Login.jsx          # Loading splash + sign in
    ├── Name.jsx           # Enter your name
    ├── Birthday.jsx       # Wheel-style birthday picker
    ├── Question.jsx       # Transitional "Question" screen
    ├── Focus.jsx          # Pick focus area
    ├── Home.jsx           # Dashboard (horoscope + tarot)
    ├── Predict.jsx        # Detailed daily prediction
    ├── Tarot.jsx          # Card-flip selection
    └── TarotResult.jsx    # Selected-card meanings
```

State flows between pages via URL search params (`useSearchParams`), preserving the original site's link-shareable behavior.

---

## Routes

| Path             | Page                                     |
|------------------|------------------------------------------|
| `/`              | Loading + sign in                        |
| `/name`          | Enter name                               |
| `/birthday`      | Pick birthday                            |
| `/question`      | Question prompt                          |
| `/focus`         | Pick focus area (love/work/health/social)|
| `/home`          | Dashboard                                |
| `/predict`       | Detailed prediction                      |
| `/tarot`         | Tarot card selection                     |
| `/tarot-result`  | Tarot card meanings                      |

---

## Email Configuration (Optional)

Out of the box, the email button uses a `mailto:` fallback. To send via EmailJS, fill in `src/lib/email.js`:

```js
export const EMAILJS_PUBLIC_KEY  = '...';
export const EMAILJS_SERVICE_ID  = '...';
export const EMAILJS_TEMPLATE_ID = '...';
```

Sign up at [emailjs.com](https://emailjs.com), create a Gmail service + a template using `{{to_name}}`, `{{to_email}}`, `{{subject}}`, `{{zodiac}}`, `{{sent_date}}`, `{{content}}`.

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the Vite app and publishes `dist/` via GitHub Pages.

To enable: in the repository's GitHub settings, **Pages → Build and deployment → Source: GitHub Actions**.

---

*HORA is intended for entertainment purposes only and does not constitute professional advice of any kind.*
