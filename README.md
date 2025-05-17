# CoverLetterGPT Clone

Generate AI-powered cover letters using GPT-4, based on a resume and job description.

## ✅ Stack
- Frontend: HTML + JS (hosted on Netlify)
- Backend: Node.js + Express (hosted on Railway)
- Payments: WayForPay

## 🔧 Setup Guide

### Step 1: Backend (Railway)
1. Go to https://railway.app → "New Project" → Empty Project
2. Add a new file `index.js` → paste backend code
3. Add `.env` file with:
   OPENAI_API_KEY=your_key_here
4. Click "Deploy"
5. After deployment, copy your backend URL (e.g. https://covergpt.up.railway.app)

### Step 2: Frontend (Netlify)
1. Push the HTML to a GitHub repo (or upload directly)
2. Go to https://netlify.com → "New site from GitHub"
3. In `index.html`, replace:
   fetch("https://YOUR_BACKEND_URL/api/generate", ...)
   with your Railway URL
4. Deploy 🎉

### Step 3: WayForPay (Built-In)
After 2 free uses, WayForPay payment button will appear.
Link used: https://secure.wayforpay.com/button/ba044d1ef050b
