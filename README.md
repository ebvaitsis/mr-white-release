# 👁 Mr. White — Party Game

## Setup (do this once)

```
npm install --legacy-peer-deps
```

## Run

```
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

---

## Android Transition Fix (v13)

- Screen transitions on Android now use `slide_from_right` animation
- Matches the smooth iOS slide behaviour
- Applied to both the root Stack navigator and the game Stack navigator
- No more flash/fade on Android when navigating between screens
