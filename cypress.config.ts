import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  experimentalModifyObstructiveThirdPartyCode: true,
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on) {
      on('before:browser:launch', (browser = {
        name: '',
        family: 'chromium',
        channel: '',
        displayName: '',
        version: '',
        majorVersion: '',
        path: '',
        isHeaded: false,
        isHeadless: false
      }, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-password-generation');
          launchOptions.args.push('--disable-save-password-bubble');
          launchOptions.args.push('--guest');
        }
        return launchOptions;
      });
    },
  },
});