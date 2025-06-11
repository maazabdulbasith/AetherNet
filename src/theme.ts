import { extendTheme } from '@chakra-ui/react';

// Hacker theme colors
const colors = {
  brand: {
    // Matrix green
    primary: '#00ff00',
    // Darker green for hover states
    primaryDark: '#00cc00',
    // Terminal black
    background: '#0a0a0a',
    // Slightly lighter black for cards
    cardBg: '#121212',
    // AI model colors
    gemini: '#4285F4', // Google Blue
    mistral: '#7C3AED', // Purple
    llama: '#FF6B6B', // Coral
    falcon: '#10B981', // Emerald
    phi: '#F59E0B', // Amber
    cohere: '#EC4899', // Pink
  },
};

const components = {
  Box: {
    baseStyle: {
      bg: 'brand.background',
    },
  },
  Text: {
    baseStyle: {
      color: 'brand.primary',
    },
  },
  Input: {
    baseStyle: {
      field: {
        bg: 'brand.cardBg',
        color: 'brand.primary',
        borderColor: 'brand.primary',
        _hover: {
          borderColor: 'brand.primaryDark',
        },
        _focus: {
          borderColor: 'brand.primary',
          boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)',
        },
      },
    },
  },
  Button: {
    baseStyle: {
      bg: 'brand.cardBg',
      color: 'brand.primary',
      borderColor: 'brand.primary',
      _hover: {
        bg: 'brand.primary',
        color: 'brand.background',
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: 'brand.background',
        border: '1px solid',
        borderColor: 'brand.primary',
      },
    },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  colors,
  components,
  config,
  styles: {
    global: {
      body: {
        bg: 'brand.background',
        color: 'brand.primary',
      },
    },
  },
}); 