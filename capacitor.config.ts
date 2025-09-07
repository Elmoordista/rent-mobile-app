import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.myapp',
  appName: '3pf Rent App',
  webDir: 'dist',
  // bundledWebRuntime: false, // <-- remove this line in Capacitor 5+
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
    },
  },
};

export default config;
