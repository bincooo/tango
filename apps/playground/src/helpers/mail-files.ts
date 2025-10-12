const packageJson = {
  name: 'demo',
  private: true,
  dependencies: {
    '@music163/tango-boot': '0.3.5',
    react: '17.0.2',
    'react-dom': '17.0.2',
    'prop-types': '15.7.2',
    tslib: '2.5.0',
  },
};

const tangoConfigJson = {
  designerConfig: {
    autoGenerateComponentId: true,
  },
  packages: {
    react: {
      version: '17.0.2',
      library: 'React',
      type: 'dependency',
      resources: ['https://unpkg.com/react@{{version}}/umd/react.development.js'],
    },
    'react-dom': {
      version: '17.0.2',
      library: 'ReactDOM',
      type: 'dependency',
      resources: ['https://unpkg.com/react-dom@{{version}}/umd/react-dom.development.js'],
    },
    'react-is': {
      version: '16.13.1',
      library: 'ReactIs',
      type: 'dependency',
      resources: ['https://unpkg.com/react-is@{{version}}/umd/react-is.production.min.js'],
    },
    '@music163/tango-boot': {
      description: '云音乐低代码运行时框架',
      version: '0.2.5',
      library: 'TangoBoot',
      type: 'baseDependency',
      resources: ['https://unpkg.com/@music163/tango-boot@{{version}}/dist/boot.js'],
      // resources: ['http://localhost:9001/boot.js'],
    },
    '@music163/tango-mail': {
      description: 'TangoMail 基础物料',
      version: '0.2.4',
      library: 'TangoMail',
      type: 'baseDependency',
      resources: ['https://unpkg.com/@music163/tango-mail@{{version}}/dist/index.js'],
      designerResources: ['https://unpkg.com/@music163/tango-mail@{{version}}/dist/designer.js'],
    },
  },
};

const routesCode = `
import Mail from "./pages/mail";

const routes = [
  {
    path: '/',
    exact: true,
    component: Mail,
  },
];

export default routes;
`;

const entryCode = `
import { runApp } from '@music163/tango-boot';
import routes from './routes';

runApp({
  boot: {
    mountElement: document.querySelector('#root'),
    qiankun: false,
  },

  router: {
    type: 'browser',
    config: routes,
  },
});
`;

const viewHomeCode = `
import React from 'react';


const WelcomeEmail = () => (
  <div>
    1234
  </div>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center',
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};

export default WelcomeEmail;
`;

export const mailFiles = [
  { filename: '/package.json', code: JSON.stringify(packageJson) },
  { filename: '/tango.config.json', code: JSON.stringify(tangoConfigJson) },
  { filename: '/README.md', code: '# readme' },
  { filename: '/src/index.ts', code: entryCode },
  { filename: '/src/pages/mail.tsx', code: viewHomeCode },
  { filename: '/src/routes.ts', code: routesCode },
];
