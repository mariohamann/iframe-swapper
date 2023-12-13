import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  rootDir: '.',
  files: 'iframe-swapper.spec.js',
  concurrentBrowsers: 3,
  nodeResolve: true,
  testFramework: {
    config: {
      timeout: 5000,
      retries: 1
    }
  },
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
  ],
};
