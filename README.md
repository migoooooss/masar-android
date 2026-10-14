# مسار — لوحة إدارة الأهداف لعشرة أشهر

تطبيق ويب عربي (RTL) لإدارة الأهداف وقياس التقدم اليومي. يعمل بالكامل داخل المتصفح، ولا يحتاج إلى خادم أو حساب أو مفاتيح API.

## المزايا

- لوحة عامة لمؤشرات التقدم، الدخل الشهري، المدخرات، وساعات التركيز.
- سجل يومي مفصل للعمل وتطوير المهارة والدراسة واللياقة واللغات والمال والطاقة والملاحظات.
- تعديل أو حذف أي سجل بحسب التاريخ.
- مستهدفات قابلة للتعديل وتاريخ بداية لخطة مدتها عشرة أشهر.
- رسوم بيانية مرسومة داخل التطبيق دون مكتبات خارجية.
- تقارير بفترة زمنية قابلة للاختيار، مع طباعة أو حفظ PDF من المتصفح.
- تصدير السجل اليومي بصيغة CSV.
- تصدير واستيراد نسخة احتياطية كاملة بصيغة JSON.
- تصميم متجاوب للهاتف والحاسوب، بلون أبيض وأخضر زمردي مع وضع داكن.
- سجل الصلاة اليومي مع تسجيل المسجد أو البيت ومؤشر نقاط شخصي.
- تسجيل يدوي لوقت TikTok وYouTube والذكاء الاصطناعي بتوزين مختلف.
- تحديات شخصية متدرجة لمدة تصل إلى 300 يوم، مع سجل إنجاز وملاحظات.
- تذكير ماء أثناء بقاء الصفحة مفتوحة، مع تنبيهات المتصفح عند السماح بها.
- لا توجد اتصالات بخدمات خارجية ولا تحليلات تتبع.

## تشغيل محلي

افتح `index.html` مباشرة في المتصفح. ولأفضل توافق، يمكن تشغيل خادم محلي بسيط من مجلد المشروع:

```bash
python -m http.server 8000
```

ثم افتح `http://localhost:8000`.

## النشر على GitHub Pages

1. أنشئ مستودعًا جديدًا على GitHub.
2. ارفع `index.html` و`styles.css` و`app.js` و`enhancements.js` و`README.md` (وملف `LICENSE` إن رغبت).
3. افتح **Settings → Pages**.
4. في **Build and deployment** اختر **Deploy from a branch**.
5. اختر الفرع `main` والمجلد `/(root)` ثم اضغط **Save**.
6. انتظر حتى يظهر رابط الموقع في صفحة Pages.

لا يحتاج هذا المشروع إلى Node.js أو بناء أو تثبيت dependencies. وهو مناسب للنشر من جذر المستودع. إذا اخترت مجلدًا فرعيًا، ارفع الملفات إلى ذلك المجلد واختره من إعدادات Pages إذا كان الخيار متاحًا.

## حفظ البيانات والخصوصية

- بيانات التطبيق وسجل العادات محفوظة في `localStorage` داخل المتصفح وعلى الجهاز الحالي. النسخة JSON تشمل بيانات العادات أيضًا.
- لا تتم مزامنة البيانات بين الأجهزة تلقائيًا.
- مسح بيانات الموقع/المتصفح قد يحذف سجلاتك. نزّل نسخة JSON دوريًا واحفظها خارج الجهاز.
- استيراد JSON يستبدل البيانات الموجودة بعد طلب التأكيد.
- لا تدخل كلمات مرور أو بيانات شديدة الحساسية في الملاحظات.

## طريقة حساب المؤشرات

- **التقدم العام:** متوسط 8 مؤشرات (الدخل الشهري، الادخار، العمل/تطوير المهارة، الدراسة، جلسات التمرين، وممارسة اللغات الثلاث). لكل مؤشر سقف 100%.
- **الدخل الشهري:** مجموع الدخل بالدولار في الشهر الحالي. دخل EGP منفصل ولا يُحوّل تلقائيًا إلى USD لعدم وجود سعر صرف مباشر.
- **المدخرات:** مجموع مبالغ `savedUsd` المسجلة. المصروفات لا تُخصم تلقائيًا من المدخرات؛ سجّل المبلغ الذي أضفته فعليًا للادخار.
- **العمل:** مجموع ساعات العمل المدفوع وتطوير المهارة.
- **الدراسة:** مجموع ساعات الدراسة، ويُعرض أيضًا متوسط ساعات الدراسة لكل يوم مسجل في التقرير التحليلي.
- **اللياقة:** عدد الأيام التي علّمت فيها «جلسة تمرين» كمكتملة. دقائق التمرين تُعرض كمؤشر مستقل.
- **اللغات:** نسبة تقريبية لممارسة الدقائق وفق عتبات داخلية قابلة للتطوير؛ هذه ليست معادلة معتمدة لتحويل الوقت إلى مستوى CEFR. حدّث مستواك الحالي يدويًا بعد تقييم فعلي.
- **الانتظام:** عدد أيام النشاط المسجلة في آخر سبعة أيام مقسومًا على سبعة.
- الأرقام المستهدفة الافتراضية أمثلة قابلة للتعديل، وليست ضمانًا لنتيجة مالية أو دراسية أو بدنية.

## بنية المشروع

```text
goal-command-center/
├── index.html
├── styles.css
├── app.js
├── README.md
└── LICENSE
```

## ملاحظات تقنية

- لا توجد مكتبات أو خطوط أو صور خارجية مطلوبة.
- التخزين: `localStorage`.
- الرسوم: Canvas API.
- التصدير: Blob API، والنسخ الاحتياطي بصيغة JSON، والتقرير للطباعة عبر `window.print()`.

## حدود التذكيرات ووقت الشاشة

- وقت التطبيقات يُدخل يدويًا؛ صفحة ويب عادية لا تملك صلاحية قراءة مدة استخدام TikTok أو YouTube أو التطبيقات الأخرى من الهاتف.
- تذكير الماء داخل الصفحة يعتمد على بقاء الموقع مفتوحًا؛ قد يوقف نظام الهاتف أو المتصفح المؤقتات في الخلفية.
- تحديات الشخصية مولّدة محليًا من برنامج متدرج لعشرة مراحل، ولا تحتاج إلى اتصال خارجي.


## Capacitor Android app (new)

This project now includes a Capacitor/Vite scaffold while retaining the existing HTML, CSS, JavaScript, local-storage keys, JSON backup format, and current features.

### Requirements

- Node.js 22 or newer
- Android Studio (current Capacitor 8-compatible version) with Android SDK installed
- A computer that can run Android Gradle builds

### Build and open Android project

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

In Android Studio, allow Gradle sync to finish. To create a test APK, use **Build > Build Bundle(s) / APK(s) > Build APK(s)** in Android Studio. Alternatively, on Windows run `cd android; .\gradlew.bat assembleDebug`; on macOS/Linux run `cd android && ./gradlew assembleDebug`. The debug APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`. You can also push the project to GitHub and run the included **Build Masar Android APK** workflow; it uploads the debug APK as a workflow artifact.

### First native integration

`native-bridge.js` adds native Android local notifications for the existing water reminder. The app schedules up to 32 future reminders covering approximately the next 24 hours and refreshes the schedule when the app becomes active. Reminders are approximate; exact-alarm permission is intentionally not requested. The web version still uses its original in-page/browser reminder behavior.

### Data migration warning

Android WebView storage is separate from browser storage and from the website's origin. Existing data will **not automatically appear** in the APK. On the old website, export a Masar JSON backup; install/open the APK and import that backup from Settings. Do not clear the old browser data until you have verified the imported records and exported a second backup.

### Current scope and limitations

- This is a Capacitor project scaffold; an Android native project and APK are generated on a machine with Android Studio/SDK after running the commands above.
- Screen-time statistics are not yet implemented natively. They require a custom Kotlin Capacitor plugin using Android `UsageStatsManager` and a user-granted special access setting.
- Prayer-time calculation/location integration, secure app lock, cloud sync, AI backend, and extended health/learning modules remain planned phases. They are not represented as completed features.
- JSON export/import currently uses the existing web implementation; verify file picker/download behavior on the target Android device before relying on it. Native Filesystem/Share integration is a next hardening step.

### Privacy

The app requests notification permission only when reminders are enabled. This phase does not request location, contacts, camera, microphone, or Accessibility permissions. See `ANDROID_PERMISSIONS.md` before adding future native permissions.

## توسعة Android: وقت الشاشة، القفل، الطعام، والأدوات

- `mobile-features.js` يضيف سجل الطعام، مؤشرات الخطر والإهمال، ساعة الإيقاف، المؤقت، الثيمات، وقفل PIN.
- بيانات الطعام وإعدادات المظهر والتذكيرات تدخل في نسخة JSON الاحتياطية؛ قفل PIN لا يُصدّر عمدًا.
- قراءة الاستخدام الفعلي للتطبيقات تتطلب APK Android وتكامل `UsageStatsManager` وصلاحية Usage Access التي يمنحها المستخدم من إعدادات النظام. لا تُستخدم Accessibility Service ولا يتم حظر التطبيقات.
- إعدادات أوقات الصلاة يدوية؛ لا تعتمد على الموقع الجغرافي ولا تحسب المواقيت الفلكية تلقائيًا. إشعارات Android قد تتأخر بسبب إعدادات البطارية، وتُجدول للأيام السبعة التالية عند فتح التطبيق أو رجوعه إلى الواجهة. يمكن اختيار التنبيهات الدقيقة، لكنها تتطلب إذن وصول خاصًا وقد تظل خاضعة لقيود Android.
- أصوات الإشعارات المرفقة: `masar_default.wav` و`masar_bell.wav` و`masar_soft.wav` داخل `android-native/res/raw`. يقوم `scripts/prepare-android.sh` بنسخها إلى `android/app/src/main/res/raw` وتسجيل إضافة UsageStats في مشروع Android الذي ينشئه Capacitor.

### بناء APK مع التكامل الأصلي

```bash
npm install
npm run build
npx cap add android
bash scripts/prepare-android.sh
npx cap sync android
npx cap open android
```

ثم من Android Studio اختر **Build → Build Bundle(s) / APK(s) → Build APK(s)**. سير عمل GitHub Actions ينفذ خطوة تجهيز التكامل الأصلي تلقائيًا بعد إنشاء مشروع Android.

### تغيير أصوات الإشعارات

1. ضع ملف صوت قصير بصيغة WAV داخل `android-native/res/raw/` باسم لاتيني صغير مثل `masar_bell.wav`.
2. أضف اسم الملف دون الامتداد إلى `ensureChannel()` في `native-bridge.js` كقيمة `sound` للقناة المناسبة.
3. أعد تشغيل `scripts/prepare-android.sh` ثم `npx cap sync android` وأعد بناء APK.
4. Android يحتفظ بإعداد صوت قناة الإشعارات بعد إنشائها؛ إذا غيّرت صوت قناة موجودة، استخدم معرّف قناة جديدًا أو امسح بيانات التطبيق/أعد تثبيته للاختبار. اختيار صوت النظام الافتراضي يظل متاحًا من إعدادات الهاتف.

### ملاحظات أمان

قفل PIN قفل واجهة محلي لحماية الاستخدام العابر وليس خزنة مشفرة أو بديلًا عن قفل الجهاز. لا تستخدمه وحده لحماية معلومات شديدة الحساسية. بيانات استخدام التطبيقات تُعرض محليًا ولا تُرسل إلى أي خادم.
