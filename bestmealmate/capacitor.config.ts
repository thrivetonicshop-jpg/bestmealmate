import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bestmealmate.app',
  appName: 'BestMealMate',
  webDir: 'out',
  server: {
    // Load from production URL (hybrid app approach for API-dependent apps)
    url: 'https://www.bestmealmate.com',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#10B981',
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'AAB'
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#10B981',
      showSpinner: false
    }
  }
};

export default config;
