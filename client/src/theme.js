import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#202225',
      paper: '#36393f',
    },
    primary: {
      main: '#7289da',
    },
    error: {
      main: '#f04747',
    },
  },
});

// export const theme = {
//   colors: {
//     black: '#000000',
//     white: '#FFFFFF',
//     grey: '#23272A',
//     darkGrey: '#2C2F33',
//     blurple: '#7289DA',
//     greyple: '#99AAB5',
//   }
// };
