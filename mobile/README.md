# Boatly (Mobile) — Expo scaffold

This folder contains a minimal Expo-based React Native scaffold that mirrors key pages from the web app: Login, Dashboard, Settings and a Map screen.

What I added
- `App.js` — Navigation and screen wiring (React Navigation).
- `screens/` — `LoginScreen.js`, `DashboardScreen.js`, `SettingsScreen.js`, `MapScreen.js`.
- `api/client.js` — central place to set `baseURL` for your backend.
- `package.json` — basic dependencies for an Expo app.

How to run
1. Install Expo CLI (if you don't have it):

```bash
npm install -g expo-cli
```

2. Install dependencies inside `mobile/`:

```bash
cd mobile
npm install
```

3. Start the Expo dev server and open the app in simulator or device:

```bash
npm start
# or
npm run android
npm run ios
```

Important notes & next steps
- Authentication: The web app uses NextAuth (cookie-based). Mobile apps commonly use token-based auth (JWT). The scaffold's `LoginScreen` is a placeholder — you should implement a mobile-friendly auth endpoint (e.g. issue a JWT on successful credentials) or implement OAuth on mobile (with PKCE for providers).

- API base URL: Edit `mobile/api/client.js` to set `api.baseURL` depending on where the Next.js backend is running. For Android emulator use `http://10.0.2.2:3000`, for iOS simulator `http://localhost:3000`, for physical devices use your machine IP.

- Maps: `MapScreen` uses `react-native-maps`. Follow the official installation instructions for `react-native-maps` / Expo if you eject or if native setup is required.

- Data shapes: The screens assume the backend `GET /api/marina` returns a marina object, and `GET /api/spots` returns an array of spots with `lat`, `lng`, `name`, `size`, `price`. Adjust mapping code to match your backend.

- Further improvements:
  - Implement token-based mobile auth and persist tokens in secure storage.
  - Add better error handling and loading states.
  - Add forms to create/update/delete spots via the API.

If you'd like, I can:
- Wire a proper mobile auth flow (JWT issuing route on the Next.js backend and secure storage on mobile).
- Add forms to create/edit spots from mobile.
- Set up environment-based config for API base URL.

