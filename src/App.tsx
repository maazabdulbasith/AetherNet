import { ChakraProvider, Box, Grid } from '@chakra-ui/react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { TopBar } from './components/TopBar';
import { theme } from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
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
