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
      '@dissonance/components': path.resolve(__dirname, 'src/components/'),
      '@dissonance/hooks': path.resolve(__dirname, 'src/hooks/'),
    },
  },
};
