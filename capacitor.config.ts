import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.masar.personal',
  appName: 'Masar',
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false
  },
  plugins: {
    LocalNotifications: {
      iconColor: '#047857'
    }
  }
};

export default config;
