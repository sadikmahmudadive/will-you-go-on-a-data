# 💖 Date Proposal Website ("Will You Go On A Date With Me?")

A simple, romantic, and playful website designed to ask that special someone out on a date!

## ✨ Features

- **💌 The Big Question**: An aesthetic proposal card asking *"Will you go on a date with me? 💖"*
- **🏃‍♀️ Trick "No" Button**:
  - The "No" button runs away and teleports to random spots whenever she hovers over it with her mouse or attempts to tap it on mobile!
  - Cycles through hilarious teasing phrases (*"Are you sure? 🥺"*, *"Wrong button! 👉"*, *"Catch me if you can! 🏃‍♀️"*).
  - Every time she tries to click "No", the "Yes" button grows bigger!
- **🎉 Confetti Explosion**: Clicking "YES! 🥰" triggers a shower of celebration confetti.
- **📋 Date Questionnaire**: A smooth, interactive questionnaire asking:
  - 📅 **Date**: Preset quick dates or custom calendar picker.
  - ⏰ **Time**: Quick romantic vibes (*Sunset, Candlelight dinner, Night stroll*) or exact time picker.
  - 📍 **Place**: Cozy suggestions (*Italian bistro, Rooftop, Picnic, Arcade, Surprise me*) or custom location.
  - 🍕 **What will she eat**: Craving options (*Sushi, Pasta, Burgers, Tacos, Desserts*) or custom text.
  - 👗 **What will she wear**: Dress vibe (*Cute dress, Casual chic, Comfy sweater, Matching outfits*).
  - 💌 **Special Note / Wishlist**: Optional personal message.
- **💾 JSON Data Storage**:
  - Automatically downloads a formatted `date-plan.json` upon completion.
  - Shows an adorable **Date Pass / Ticket** with a 1-click **"Copy Date Plan"** button to paste directly into WhatsApp / iMessage / Instagram.
  - In local development (`npm run dev`), submissions automatically save into `date-response.json` in the root folder.
  - Vercel Serverless Function ready in `api/save.js`.

---

## 🚀 Running Locally

1. **Install dependencies** (already installed):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Check Saved Responses**:
   Whenever a date is submitted, the responses are stored in `date-response.json` right in your project folder!

---

## 🌐 Deploying to Vercel

You can host this for free on [Vercel](https://vercel.com):

### Option 1: Via Vercel Web Dashboard (Easiest)
1. Push this folder to a GitHub / GitLab repository:
   ```bash
   git init
   git add .
   git commit -m "Will you go on a date with me"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite** (Vercel automatically detects this).
5. Click **"Deploy"**!

### Option 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

### (Optional) Receive Instant Notifications
If you want her answers sent directly to your phone via Discord or a webhook when hosted on Vercel:
1. In your Vercel Project Settings, go to **Environment Variables**.
2. Add `NOTIFICATION_WEBHOOK_URL` set to your Discord / Slack / Zapier Webhook URL.
3. Every time she submits, Vercel will automatically ping your webhook!
