# Frontend connection setup

Wanderly now uses two independent repositories:

- `wanderly`: Expo/React Native frontend (this repository).
- `wanderly-backend`: Node.js + Express + TypeScript API, normally checked out beside this folder.

Supabase provides authentication and PostgreSQL. The app logs in through Supabase Auth, then sends its access token to the Node API for profile, trip, and diary requests. Database metadata, inspection SQL, generators and database tests belong to the backend repository. No existing hosted table needs to be recreated.

## Run the API

Open a terminal in `C:\Users\mejra\wanderly-backend`:

```powershell
npm.cmd ci
Copy-Item .env.example .env # only if .env does not already exist
```

Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the backend `.env`, then start it:

```powershell
npm.cmd run dev
```

The API listens on port 3000. Check `http://localhost:3000/health` in a browser. The initial local configuration was copied from your existing frontend configuration; no secret/admin key is required.

## Run the frontend

In this repository's `.env.local`, use:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_WIFI_IP:3000
```

For Expo Go on your iPhone, the API URL must contain your computer's Wi-Fi address. `localhost` on the phone refers to the phone. Keep both devices on the same network. For a browser on this computer, you can use `http://localhost:3000` instead. If your network changes, update the IP and reload Expo. Browser requests also require the frontend origin in the backend's `CORS_ORIGINS` setting. Deployed API URLs must use HTTPS.

Keep the Supabase values in the frontend: login/session handling still uses them. Never use a secret/service-role key in the app. `.env.local` is ignored by Git.

Start Expo in a separate terminal:

```powershell
npm.cmd start
```

Signed-out users see login/signup. Successful authentication opens the tabs; Profile shows the account email and sign-out. If email confirmation is enabled in Supabase, confirm the email and return to log in. Travel feature screens remain placeholders even though their API service functions are ready.

## Checks

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test:auth
npm.cmd run test:api
```

Run the backend's own lint, typecheck, build and tests from its repository. Frontend auth/API tests use controlled clients and do not create hosted accounts or records. Finish real-device verification with signup/login, restart persistence, sign-out, and a future data-entry workflow. Database RLS flags, triggers, constraints and photo storage still need hosted verification; the backend includes a read-only inspection query. Password recovery, resend-confirmation controls and automatic confirmation callbacks remain future work.
