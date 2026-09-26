# Yono Bonus Link - Firebase Hosting Configuration

This project is configured for **Firebase Hosting (classic / static SPA hosting)** on the free tier (Spark plan, no Blaze billing required).

## Firebase Project Information
- **Project ID**: `gen-lang-client-0219310736`
- **Default Hosting URL**: `https://gen-lang-client-0219310736.web.app`
- **Secondary Hosting URL**: `https://gen-lang-client-0219310736.firebaseapp.com`

## Static SPA Configuration (`firebase.json`)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

All SPA routes (`/`, `/about`, `/contact`, `/disclaimer`, `/telegram`, `/app/:slug`, `/admin/login`, `/admin/*`) rewrite to `/index.html`.
