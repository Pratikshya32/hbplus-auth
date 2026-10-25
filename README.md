# HBPlus Authentication

A responsive Google sign-in portal for HBPlus, built with Expo, Expo Router, React Native, React Native Web, TypeScript, and Firebase Authentication. The dark graphite interface and muted sage accents follow the supplied HBPlus reference.

## Prerequisites

- Node.js LTS and npm
- A Firebase project with the Authentication and Google provider enabled
- A Google Cloud OAuth client for each platform you plan to use
- For native builds, Expo tooling and the Android Studio or Xcode setup required by your target platform

## Install and run

```sh
npm install
cp .env.example .env
# Fill .env with your Firebase settings and native Google client IDs
npm run typecheck
npm run web:build
npm run web
```

On Windows PowerShell, use `Copy-Item .env.example .env` in place of `cp`. Start native development with `npm run android` or `npm run ios`. Restart Expo after changing `.env`. The `.env` file is ignored by Git; never commit real credentials. `EXPO_PUBLIC_` values are included in the client bundle, so treat them as public identifiers, never secrets.

## Firebase setup

1. Create or select a Firebase project, register a Web app, and copy the Web app settings into the six `EXPO_PUBLIC_FIREBASE_*` variables in `.env`.
2. In **Authentication → Sign-in method**, enable **Google** and choose the support email.
3. In **Authentication → Settings → Authorized domains**, add every hostname that will serve the app, including your production hostname and any custom domain.
4. For mobile, add an iOS app with the bundle identifier `fit.hbplus.auth` and an Android app with application ID `fit.hbplus.auth`. Configure each app's signing certificate fingerprints in Google Cloud/Firebase as required by your Google OAuth setup.

The web popup uses the Google provider configuration managed by Firebase Authentication; add your production hostname to Firebase's authorized domains. Native IDs are public identifiers and belong in `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` and `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`. Create an iOS client for the registered bundle ID and an Android client for the package name and signing SHA-1. Use the same Google Cloud project as Firebase. Google consent-screen publishing, test-user setup, and any organization policies are managed in Google Cloud and cannot be configured from this repository.

Native sign-in uses Expo AuthSession with an ID token and exchanges it for a Firebase credential. The registered package/bundle ID is `fit.hbplus.auth`; Expo registers both `hbplusauth` and `fit.hbplus.auth` URI schemes. AuthSession's Google provider returns to `fit.hbplus.auth:/oauthredirect`. Use a development build to test OAuth: Expo Go cannot test custom OAuth redirects. Add the actual package name, bundle ID, and signing SHA-1 for each build to the matching Google OAuth clients. Do not add OAuth client secrets to the app.

## Access control

The app accepts only a signed-in Google identity whose email ends in `@hbplus.fit`, ignoring case. Emails outside the domain receive: “Access restricted. Please login using your official domain email.” Router-protected dashboard content is withheld while authentication is unresolved or absent, including when a user opens `/dashboard` directly. Firebase persists web sessions and uses React Native AsyncStorage for native sessions when Firebase native persistence is available.

This client check controls this user interface only. It is **not** authorization for future backend APIs, Firestore, or Storage. Enforce access in trusted server code and Firebase Security Rules, checking authenticated tokens (such as a verified email and `email_verified`) and applying least privilege. Configure Google Workspace restrictions where appropriate.

## Checks and behavior

- `npm run typecheck` runs the TypeScript compiler without emitting files.
- `npm run web:build` creates a static production web export under `dist/`.
- `npm run web` starts the local web development server.
- `npm run android` / `npm run ios` start Expo for the corresponding native target.

Sign-in errors distinguish missing configuration, cancelled/closed or blocked web popups, network failures, and generic provider/configuration failures. Sign-out is available on the dashboard. Real OAuth cannot be verified until actual Firebase settings and per-platform Google OAuth clients are configured and the flow is tested against them.

## Netlify deployment

1. Connect the repository and set the Netlify base directory to `hbplus-auth` if the app lives in a monorepo.
2. Set the build command to `npm run web:build` and the publish directory to `dist` (relative to the base directory).
3. Add all environment variables from `.env.example` to the Netlify site's environment configuration. Set them for the deploy contexts you use.
4. Add the Netlify production hostname and any custom domain to Firebase Authentication's authorized domains, and the production origin to the Google OAuth web client's authorized JavaScript origins. Configure the matching OAuth redirect domain in Firebase/Google.
5. Deploy and test the deployed sign-in, an authorized `@hbplus.fit` account, a rejected account, direct `/dashboard` navigation, refresh, and sign-out.

All URLs use the Expo Router client-side app. If your Netlify setup serves direct page requests without its standard SPA fallback, add a rewrite from `/*` to `/index.html` with status `200`.
