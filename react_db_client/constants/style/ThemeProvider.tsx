import React from 'react';
import { ThemeProvider } from 'styled-components';

export interface ITheme {
  typography: {
    fontSize: string | number;
    lineHeight: string | number;
  };
  select: {
    menu: {
      border: string;
      minWidth: string | number;
    };
    item: {
      default?: string;
      onHover?: string;
      onFocus?: string;
    }
  };
  button: {
    onHover?: string;
    onFocus?: string;
  };
}

export const defaultTheme: ITheme = {
  typography: {
    fontSize: '1.2rem',
    lineHeight: '1.5rem',
  },
  select: {
    menu: {
      minWidth: '8rem',
      border: '1px solid blue',
    },
    item: {
      default: 'background: grey;',
      onHover: 'background: pink;',
      onFocus: 'background: purple;',
    }
  },
  button: {
    onHover: `background: yellow;`,
    onFocus: `background: green;`,
  },
};

export interface IReactDbClientThemeProviderProps {
  theme: ITheme;
  children: React.ReactNode;
}

export const ReactDbClientThemeProvider = (props: IReactDbClientThemeProviderProps) => {
  const theme: { reactDbClientTheme: ITheme } = {
    reactDbClientTheme: Object.assign({}, defaultTheme, props.theme),
  };
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};
