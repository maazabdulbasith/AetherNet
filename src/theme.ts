import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    // Soft green theme
    soft: {
      50: '#f0f9f0',
      100: '#dcf1dc',
      200: '#b9e3b9',
      300: '#8cd08c',
      400: '#5fb85f',
      500: '#3da03d',
      600: '#2d7a2d',
      700: '#235923',
      800: '#1c471c',
      900: '#153515',
    },
    // Ocean theme
    ocean: {
      50: '#e6f3ff',
      100: '#c0dfff',
      200: '#99cbff',
      300: '#73b7ff',
      400: '#4ca3ff',
      500: '#268fff',
      600: '#0072e6',
      700: '#0057b3',
      800: '#003d80',
      900: '#00224d',
    },
    // Sunset theme
    sunset: {
      50: '#fff5e6',
      100: '#ffe4c0',
      200: '#ffd399',
      300: '#ffc273',
      400: '#ffb04c',
      500: '#ff9f26',
      600: '#e68000',
      700: '#b36300',
      800: '#804600',
      900: '#4d2900',
    },
    // Lavender theme
    lavender: {
      50: '#f5f0ff',
      100: '#e6dcff',
      200: '#d4c3ff',
      300: '#c2aaff',
      400: '#b091ff',
      500: '#9e78ff',
      600: '#8c5fff',
      700: '#7a46ff',
      800: '#682dff',
      900: '#5614ff',
    },
  },
};

const styles = {
  global: (props: any) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'brand.soft.500' : 'brand.soft.400',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.soft.400' : 'brand.soft.500',
        },
      }),
      outline: (props: any) => ({
        borderColor: props.colorMode === 'dark' ? 'brand.soft.500' : 'brand.soft.400',
        color: props.colorMode === 'dark' ? 'brand.soft.500' : 'brand.soft.400',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.soft.900' : 'brand.soft.50',
        },
      }),
    },
  },
  Box: {
    baseStyle: {
      borderRadius: 'lg',
    },
  },
  Text: {
    baseStyle: (props: any) => ({
      color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
    }),
  },
};

export const theme = extendTheme({
  config,
  colors,
  styles,
  components,
}); 