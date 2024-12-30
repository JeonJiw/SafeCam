# Ngrok Setting

## 1. Local Development Environment

### Install

```bash
npm install
npm run start:dev  # NestJS server runs (port 3000)
ngrok http 3000 # ngrok runs


## 2. Google OAuth Setting
Google Cloud Console Setting

Go to console.cloud.google.com
OAuth 2.0 Client ID setting
Add redirection URI :

https://[your-ngrok-url]/auth/google/callback

**[your-ngrok-url] will be updated everytime running ngrok, update it in google console, .env

.env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=https://[your-ngrok-url]/auth/google/callback


## 3. Test

Run local server
Run ngrok
Google Console -> ngrok URL Update
.env update
Test here : https://[your-ngrok-url]/auth/google


```
