import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'apie-form-elements',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  globalScript: 'src/global.ts',
  testing: {
    browserHeadless: "new",
  },
};
