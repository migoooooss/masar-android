package com.masar.personal;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Process;
import android.provider.Settings;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "UsageStats")
public class UsageStatsPlugin extends Plugin {
    private boolean hasAccess() {
        Context context = getContext();
        AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
        if (appOps == null) return false;
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), context.getPackageName());
        return mode == AppOpsManager.MODE_ALLOWED;
    }

    @PluginMethod
    public void hasUsageAccess(PluginCall call) {
        JSObject result = new JSObject();
        result.put("granted", hasAccess());
        call.resolve(result);
    }

    @PluginMethod
    public void openUsageAccessSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            JSObject result = new JSObject();
            result.put("message", "فعّل السماح باستخدام البيانات لهذا التطبيق ثم ارجع إلى مسار.");
            call.resolve(result);
        } catch (Exception ex) {
            call.reject("تعذر فتح إعدادات إحصائيات الاستخدام", ex);
        }
    }

    @PluginMethod
    public void openAppNotificationSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName());
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception ex) {
            call.reject("تعذر فتح إعدادات الإشعارات", ex);
        }
    }

    @PluginMethod
    public void getUsageStats(PluginCall call) {
        if (!hasAccess()) {
            call.reject("Usage Access permission has not been granted");
            return;
        }
        try {
            long end = System.currentTimeMillis();
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            long start = calendar.getTimeInMillis();
            String period = call.getString("period", "today");
            if ("last24h".equals(period)) start = end - 24L * 60L * 60L * 1000L;
            UsageStatsManager manager = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);
            if (manager == null) { call.reject("UsageStatsManager unavailable"); return; }
            List<UsageStats> stats = manager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end);
            Map<String, Long> totals = new HashMap<>();
            if (stats != null) {
                for (UsageStats item : stats) {
                    if (item.getPackageName() == null || item.getTotalTimeInForeground() <= 0) continue;
                    Long old = totals.get(item.getPackageName());
                    totals.put(item.getPackageName(), (old == null ? 0L : old) + item.getTotalTimeInForeground());
                }
            }
            PackageManager pm = getContext().getPackageManager();
            JSArray apps = new JSArray();
            long total = 0L;
            for (Map.Entry<String, Long> entry : totals.entrySet()) {
                String packageName = entry.getKey();
                long duration = entry.getValue();
                total += duration;
                String label = packageName;
                try {
                    ApplicationInfo info = pm.getApplicationInfo(packageName, 0);
                    label = String.valueOf(pm.getApplicationLabel(info));
                } catch (PackageManager.NameNotFoundException ignored) { }
                JSObject app = new JSObject();
                app.put("packageName", packageName);
                app.put("appName", label);
                app.put("totalTimeMs", duration);
                apps.put(app);
            }
            // Sort the small result set by duration descending.
            java.util.ArrayList<JSObject> sorted = new java.util.ArrayList<>();
            for (int i = 0; i < apps.length(); i++) {
                try { sorted.add(apps.getJSONObject(i)); } catch (JSONException ignored) { }
            }
            sorted.sort((a, b) -> Long.compare(b.optLong("totalTimeMs"), a.optLong("totalTimeMs")));
            JSArray ordered = new JSArray();
            for (JSObject app : sorted) ordered.put(app);
            JSObject result = new JSObject();
            result.put("apps", ordered);
            result.put("totalTimeMs", total);
            result.put("startTime", start);
            result.put("endTime", end);
            call.resolve(result);
        } catch (Exception ex) {
            call.reject("تعذرت قراءة إحصائيات استخدام التطبيقات", ex);
        }
    }
}
