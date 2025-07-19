import { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { esES } from '@mui/x-date-pickers/locales';

import { Themes } from './types';

const sharedTheme = {
  spacing: 4,
  typography: {
    allVariants: {
      fontFamily: 'Manrope, sans-serif',
    },
  },
  palette: {
    // Mercado Fiel Primary - Verde Hoja
    primary: '#4CAF4F',
    // Mercado Fiel Secondary - Naranja Mandarina
    secondary: '#FF8A00',
    background: {
      // Neutro claro - Marfil
      default: '#F6F6F4',
      paper: '#fff',
      grey: '#F6F6F4',
    },
  },
  esES,
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#F6F6F4',
          },
          '&:hover': {
            color: '#4CAF4F',
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '33px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        vertical: {
          marginRight: 10,
          marginLeft: 10,
        },
        middle: {
          marginTop: 10,
          marginBottom: 10,
          width: '80%',
        },
      },
    },
    // MuiDigitalClock: {
    //   styleOverrides: {
    //     root: (rootStyleProps) => {
    //       console.log('rootStyleProps', rootStyleProps);
    //       return {
    //         // backgroundColor: selected ? '#970B80' : 'transparent',
    //         // color: selected ? '#fff' : '#000',
    //         borderRadius: '50%',
    //         padding: '0.5rem',
    //       };
    //     },

    //     item: (itemStyleProps) => {
    //       console.log('itemStyleProps', itemStyleProps)
    //       return {
    //         backgroundColor: itemStyleProps. ? '#970B80' : 'transparent',
    //         // color: selected ? '#fff' : '#000',
    //         borderRadius: '50%',
    //         padding: '0.5rem',
    //       };
    //     },
    //   },
    // },
  },
} as ThemeOptions;

const themes: Record<Themes, ThemeOptions> = {
  light: deepmerge(sharedTheme, {
    palette: {
      mode: 'light',
      background: {
        default: '#F6F6F4',
        paper: '#fff',
        grey: '#F6F6F4',
      },
      primary: {
        main: '#4CAF4F',
        dark: '#449A46',
        light: '#E8F5E8',
        contrastText: '#fff',
      },
      secondary: {
        main: '#FF8A00',
        dark: '#3A3A3A',
        light: '#FFE5B2',
        contrastText: '#fff',
      },
      error: {
        main: '#E94040',
      },
      warning: {
        main: '#FF8A00',
      },
      success: {
        main: '#B5E61D',
      },
      text: {
        primary: '#3A3A3A',
        secondary: '#6B6B6B',
        disabled: '#BDBDBD',
        hint: '#A0A0A0',
      },
    },
  }),
};

export default themes;
