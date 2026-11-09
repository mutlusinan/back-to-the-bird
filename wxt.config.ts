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
        gecko: {
          id: 'back-to-the-bird@mutlusinan',
          // :has() (121) and content alt text (128) are needed by the wording and hide features.
          strict_min_version: '128.0',
          // AMO requires new extensions to declare data collection; this one collects nothing.
          data_collection_permissions: { required: ['none'] },
        },
      },
    }),
  }),
});
