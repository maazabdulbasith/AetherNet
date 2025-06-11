import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
  Text,
  Divider,
  Switch,
  FormHelperText,
  Box,
  Tooltip,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { useChatStore } from '../store/chatStore';

interface APIKeys {
  google: string;
  mistral: string;
  cohere: string;
  huggingface: string;
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings = ({ isOpen, onClose }: SettingsProps) => {
  // Initialize with environment variables as defaults
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    google: import.meta.env.VITE_GOOGLE_API_KEY || '',
    mistral: import.meta.env.VITE_MISTRAL_API_KEY || '',
    cohere: import.meta.env.VITE_COHERE_API_KEY || '',
    huggingface: import.meta.env.VITE_HUGGINGFACE_API_KEY || '',
  });
  const [isLocalEnabled, setIsLocalEnabled] = useState(false);
  const [localBaseUrl, setLocalBaseUrl] = useState('http://localhost:11434');
  const toast = useToast();
  const { availableModels, updateModelBaseUrl } = useChatStore();

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      // Merge with environment variables, prioritizing localStorage
      setApiKeys({
        ...apiKeys,
        ...parsedKeys,
      });
      // Initialize AIService with saved keys
      Object.entries(parsedKeys).forEach(([provider, key]) => {
        if (key) {
          aiService.setApiKey(key as string, provider as any);
        }
      });
    } else {
      // Initialize with environment variables if no saved keys
      Object.entries(apiKeys).forEach(([provider, key]) => {
        if (key) {
          aiService.setApiKey(key, provider as any);
        }
      });
    }
    
    const savedLocalEnabled = localStorage.getItem('localEnabled');
    if (savedLocalEnabled) {
      setIsLocalEnabled(savedLocalEnabled === 'true');
    }
    const savedLocalUrl = localStorage.getItem('localBaseUrl');
    if (savedLocalUrl) {
      setLocalBaseUrl(savedLocalUrl);
    }
  }, []);

  const handleSave = async () => {
    try {
      // Save API keys
      Object.entries(apiKeys).forEach(([provider, key]) => {
        if (key) {
          aiService.setApiKey(key, provider as any);
        }
      });

      // Save local settings
      localStorage.setItem('localEnabled', isLocalEnabled.toString());
      localStorage.setItem('localBaseUrl', localBaseUrl);
      
      // Update model base URLs if local is enabled
      if (isLocalEnabled) {
        availableModels
          .filter(model => model.isLocal)
          .forEach(model => {
            updateModelBaseUrl(model.id, localBaseUrl);
          });
      }

      // Save to localStorage
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));

      toast({
        title: 'Settings saved',
        status: 'success',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleReset = () => {
    // Reset to environment variables
    setApiKeys({
      google: import.meta.env.VITE_GOOGLE_API_KEY || '',
      mistral: import.meta.env.VITE_MISTRAL_API_KEY || '',
      cohere: import.meta.env.VITE_COHERE_API_KEY || '',
      huggingface: import.meta.env.VITE_HUGGINGFACE_API_KEY || '',
    });
    localStorage.removeItem('apiKeys');
    toast({
      title: 'Settings reset to defaults',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>API Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" opacity={0.7}>
              Enter your API keys to enable different AI models. Some models are free to use.
            </Text>
            
            <Box
              p={4}
              border="1px solid"
              borderColor="brand.primary"
              borderRadius="md"
              bg="brand.cardBg"
            >
              <FormControl>
                <FormLabel>Local Models (Ollama)</FormLabel>
                <Switch
                  isChecked={isLocalEnabled}
                  onChange={(e) => setIsLocalEnabled(e.target.checked)}
                  colorScheme="green"
                />
                <FormHelperText>
                  Enable to use local models through Ollama
                </FormHelperText>
              </FormControl>

              {isLocalEnabled && (
                <FormControl mt={4}>
                  <FormLabel>Ollama Base URL</FormLabel>
                  <Input
                    value={localBaseUrl}
                    onChange={(e) => setLocalBaseUrl(e.target.value)}
                    placeholder="http://localhost:11434"
                  />
                  <FormHelperText>
                    URL where Ollama is running
                  </FormHelperText>
                </FormControl>
              )}
            </Box>

            <Divider borderColor="brand.primary" />

            <Box
              p={4}
              border="1px solid"
              borderColor="brand.gemini"
              borderRadius="md"
              bg="brand.cardBg"
            >
              <FormControl>
                <FormLabel color="brand.gemini">Google API Key</FormLabel>
                <Input
                  value={apiKeys.google}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, google: e.target.value })
                  }
                  placeholder="Enter Google API key"
                />
                <FormHelperText>
                  Required for Gemini Pro
                </FormHelperText>
              </FormControl>
            </Box>

            <Box
              p={4}
              border="1px solid"
              borderColor="brand.mistral"
              borderRadius="md"
              bg="brand.cardBg"
            >
              <FormControl>
                <FormLabel color="brand.mistral">Mistral API Key</FormLabel>
                <Input
                  value={apiKeys.mistral}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, mistral: e.target.value })
                  }
                  placeholder="Enter Mistral API key"
                />
                <FormHelperText>
                  Required for Mistral Cloud models
                </FormHelperText>
              </FormControl>
            </Box>

            <Box
              p={4}
              border="1px solid"
              borderColor="brand.cohere"
              borderRadius="md"
              bg="brand.cardBg"
            >
              <FormControl>
                <FormLabel color="brand.cohere">Cohere API Key</FormLabel>
                <Input
                  value={apiKeys.cohere}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, cohere: e.target.value })
                  }
                  placeholder="Enter Cohere API key"
                />
                <FormHelperText>
                  Required for Cohere models
                </FormHelperText>
              </FormControl>
            </Box>

            <Box
              p={4}
              border="1px solid"
              borderColor="brand.falcon"
              borderRadius="md"
              bg="brand.cardBg"
            >
              <FormControl>
                <FormLabel color="brand.falcon">HuggingFace API Key</FormLabel>
                <Input
                  value={apiKeys.huggingface}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, huggingface: e.target.value })
                  }
                  placeholder="Enter HuggingFace API key"
                />
                <FormHelperText>
                  Required for HuggingFace models
                </FormHelperText>
              </FormControl>
            </Box>

            <Text fontSize="sm" opacity={0.7}>
              OpenAI and Anthropic models are coming soon in the premium tier.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save API Keys
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 