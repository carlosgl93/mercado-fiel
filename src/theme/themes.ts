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
} as ThemeOptions; // the reason for this casting is deepmerge return type

const themes: Record<Themes, ThemeOptions> = {
  light: deepmerge(sharedTheme, {
    palette: {
      mode: 'light',
      background: {
        // Neutro claro - Marfil
        default: '#F6F6F4',
        paper: '#fff',
        grey: '#F6F6F4',
      },
      primary: {
        // Verde Hoja
        main: '#4CAF4F',
        // Darker version for hover states
        dark: '#449A46',
        // Lighter version for backgrounds
        light: '#E8F5E8',
        contrastText: '#fff',
      },
      secondary: {
        // Neutro claro como secondary background
        main: '#F6F6F4',
        // Neutro oscuro - Grafito
        dark: '#3A3A3A',
        // Naranja Mandarina como contraste
        contrastText: '#FF8A00',
      },
      error: {
        // Rojo Tomate
        main: '#E94040',
      },
      warning: {
        // Naranja Mandarina
        main: '#FF8A00',
      },
      success: {
        // Verde Lima para badges y micro-interacciones
        main: '#B5E61D',
      },
      // text: {
      //   // Neutro oscuro - Grafito
      //   primary: '#3A3A3A',
      //   secondary: '#3A3A3A',
      // },
    },
  }),
};

export default themes;
