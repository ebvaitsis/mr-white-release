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

## What's new in v12

- **Language selection moved to the home screen** — toggle between 🇬🇧 English and 🇬🇷 Greek directly on the main screen
- Language preference is saved automatically and remembered on next launch
- "How to Play" screen is now fully bilingual based on the selected language
- Setup screen reads language from global settings (no more language picker inside setup)
- All downstream game screens still respect the language set at game creation time

---

## How the game works

1. Choose your language on the home screen
2. Enter player names
3. Pass the phone — each player secretly views their role
4. Everyone gives ONE word clue
5. Vote for who you think is Mr. White
6. Eliminated player is revealed
7. Mr. White gets one guess if caught
8. First to complete the objective wins!
