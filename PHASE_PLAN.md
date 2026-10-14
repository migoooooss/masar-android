# Masar Android implementation roadmap

## Included in this expanded phase
- Preserve the original goal tracker and its localStorage key.
- Capacitor 8 + Vite project and GitHub Actions debug APK workflow.
- Native `UsageStatsManager` bridge with a button that opens Android Usage Access settings and reads per-app foreground time after permission is granted.
- Actual-use classification for TikTok, YouTube, known AI apps, and other apps; the user can review and save it into the existing daily screen-time log.
- Local water notifications, user-defined prayer-time notifications, and daily habit reminders, with a button for Android notification settings and optional exact-alarm access.
- Three bundled notification tones and instructions for adding more `.wav` files.
- Optional PIN gate with an animated lock screen and salted SHA-256 hash; no raw PIN is stored or exported.
- Theme/accent customization, food log with three broad categories, red risk/neglect indicator, stopwatch, and countdown timer.
- Food records and non-secret mobile settings included in JSON backup/restore. PIN data is intentionally excluded.
- No AI coach and no server-side data transmission.

## Still requires device verification
- Build the APK with Android SDK/Gradle and test the custom native plugin on a real Android device.
- Verify Usage Access on the user's Android version and device manufacturer.
- Verify notification permission, exact-alarm access, custom sounds, battery optimization behavior, and notification channel settings.
- Verify PIN lock/unlock, JSON round-trip, timer notifications while backgrounded, and app restart behavior.

## Known limitations
- Prayer times are entered manually; no astronomical calculation or location permission is included.
- Android may delay notifications unless exact alarms are allowed; battery-management behavior differs by manufacturer.
- UsageStatsManager reports app foreground time, which may not equal every device's built-in digital-wellbeing number exactly. App names may be unavailable for packages hidden by Android package visibility.
- The PIN gate is a local UI lock, not encrypted storage and not a substitute for Android device security.
- Stopwatch/timer display relies on JavaScript while the app is active; native local notification is scheduled for the countdown end when the notification permission is granted.
- This environment could not complete `npm install`, so an APK build and Android compilation have not been verified here.
