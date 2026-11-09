import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifestVersion: 3,
  manifest: ({ browser }) => ({
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    permissions: ['storage', 'scripting', 'alarms'],
    host_permissions: ['https://x.com/*'],
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: { id: 'back-to-the-bird@mutlusinan' },
      },
    }),
  }),
});
