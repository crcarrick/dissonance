const path = require('path');

module.exports = {
  babel: {
    plugins: [
      [
        'babel-plugin-import',
        {
          libraryName: '@material-ui/core',
          libraryDirectory: 'esm',
          camel2DashComponentName: false,
        },
        'core',
      ],
      [
        'babel-plugin-import',
        {
          libraryName: '@material-ui/icons',
          libraryDirectory: 'esm',
          camel2DashComponentName: false,
        },
        'icons',
      ],
    ],
  },

  webpack: {
    alias: {
      '@dissonance/assets': path.resolve(__dirname, 'src/assets/'),
      '@dissonance/client': path.resolve(__dirname, 'src/client.js'),
      '@dissonance/components': path.resolve(__dirname, 'src/components/'),
      '@dissonance/contexts': path.resolve(__dirname, 'src/contexts/'),
      '@dissonance/data': path.resolve(__dirname, 'src/data/'),
      '@dissonance/hooks': path.resolve(__dirname, 'src/hooks/'),
    },
  },
};
