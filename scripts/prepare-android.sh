#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID="$ROOT/android"
JAVA_DIR="$ANDROID/app/src/main/java/com/masar/personal"
mkdir -p "$JAVA_DIR" "$ANDROID/app/src/main/res/raw"
cp "$ROOT/android-native/java/com/masar/personal/UsageStatsPlugin.java" "$JAVA_DIR/UsageStatsPlugin.java"
cp "$ROOT/android-native/java/com/masar/personal/MainActivity.java" "$JAVA_DIR/MainActivity.java"
cp "$ROOT/android-native/res/raw/masar_default.wav" "$ANDROID/app/src/main/res/raw/masar_default.wav"
cp "$ROOT/android-native/res/raw/masar_bell.wav" "$ANDROID/app/src/main/res/raw/masar_bell.wav"
cp "$ROOT/android-native/res/raw/masar_soft.wav" "$ANDROID/app/src/main/res/raw/masar_soft.wav"
python3 - "$ANDROID/app/src/main/AndroidManifest.xml" <<'PY'
import sys
from pathlib import Path
p=Path(sys.argv[1]); s=p.read_text()
permissions=['    <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" />','    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />']
for permission in permissions:
    name=permission.split('name="')[1].split('\"')[0]
    if name not in s:
        s=s.replace('<application', permission+'\n    <application', 1)
p.write_text(s)
PY
echo "Masar Android native plugin, Usage Access permission, and notification sounds installed."
