import { ChakraProvider, Box, Grid, ColorModeScript } from '@chakra-ui/react';
import { Sidebar } from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { TopBar } from './components/TopBar';
import { theme } from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Grid templateColumns="300px 1fr" h="100vh">
        <Sidebar />
        <Box>
          <TopBar />
          <ChatInterface />
        </Box>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
