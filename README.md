# Table Image Generator (Node.js + OpenAI)

This backend allows your frontend (hosted on GoDaddy) to generate custom table images using OpenAI's DALL·E API.

---

## 🔧 Setup Instructions (For Dummies)

### 1. Create a Free Account on Render
Go to https://render.com and sign up for a free account.

---

### 2. Upload This Code to GitHub
- Create a GitHub account if you don’t have one (https://github.com)
- Create a new **repository** called `table-image-generator`
- Upload the files from this ZIP to that repository

---

### 3. Deploy to Render
- In Render, click **"New Web Service"**
- Connect your GitHub account
- Select your `table-image-generator` repo
- Set the following:
  - **Environment:** Node
  - **Build Command:** `npm install`
  - **Start Command:** `node server.js`

---

### 4. Add Your OpenAI API Key
- Go to **Environment Variables**
- Add one called `OPENAI_API_KEY`
- Paste your API key from https://platform.openai.com/account/api-keys

---

### 5. Go Live
After deployment, Render will give you a URL like:
```
https://yourapp.onrender.com/generate-image
```

---

## 🌐 Hook It Into Your GoDaddy Site

In your GoDaddy HTML (builder.html), make your JS call this URL like:

```js
fetch('https://yourapp.onrender.com/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    shape: 'Round',
    size: '48',
    resin1: 'Iowa State 1',
    resin2: 'Iowa State 2',
    finish: 'Gloss'
  })
})
.then(res => res.json())
.then(data => {
  document.getElementById('preview-img').src = data.imageUrl;
});
```

And you’re done! 🎉
