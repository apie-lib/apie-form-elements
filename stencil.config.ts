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
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        { src: 'pages' },
      ],
    }
  ],
  globalStyle: 'src/global.scss',
  testing: {
    browserHeadless: "new",
  },
};
