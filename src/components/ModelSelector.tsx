import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Checkbox,
  Button,
  Text,
  useToast,
  Box,
  Flex,
  Icon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiCpu, FiMessageSquare, FiZap } from 'react-icons/fi';
import type { AIModel } from '../types';

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (models: AIModel[]) => void;
  availableModels: AIModel[];
}

const getModelColor = (modelId: string) => {
  switch (modelId) {
    case 'gemini-pro':
      return {
        bg: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
        border: '#4285F4',
        icon: FiZap
      };
    case 'mistral-medium':
      return {
        bg: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        border: '#7C3AED',
        icon: FiCpu
      };
    case 'cohere-command-r-plus':
      return {
        bg: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)',
        border: '#EC4899',
        icon: FiMessageSquare
      };
    case 'HuggingFaceH4/zephyr-7b-beta':
      return {
        bg: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        border: '#10B981',
        icon: FiCpu
      };
    default:
      return {
        bg: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
        border: '#00ff00',
        icon: FiCpu
      };
  }
};

export const ModelSelector = ({
  isOpen,
  onClose,
  onSelect,
  availableModels,
}: ModelSelectorProps) => {
  const [selectedModels, setSelectedModels] = useState<AIModel[]>([]);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const handleToggleModel = (model: AIModel) => {
    setSelectedModels((prev) =>
      prev.some((m) => m.id === model.id)
        ? prev.filter((m) => m.id !== model.id)
        : [...prev, model]
    );
  };

  const handleCreate = () => {
    if (selectedModels.length === 0) {
      toast({
        title: 'No models selected',
        description: 'Please select at least one AI model to start a chat.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }
    onSelect(selectedModels);
    setSelectedModels([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent 
        maxH="80vh" 
        display="flex" 
        flexDirection="column"
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
      >
        <ModalHeader 
          fontSize="2xl" 
          fontWeight="bold" 
          bg="transparent"
          borderBottom="1px solid"
          borderColor={borderColor}
          pb={4}
          color={textColor}
        >
          Select AI Models
        </ModalHeader>
        <ModalCloseButton 
          top={4} 
          right={4}
          color={textColor}
          _hover={{ color: 'gray.500' }}
        />
        <ModalBody flex="1" overflowY="auto" pb={6}>
          <VStack spacing={4} align="stretch">
            {availableModels.map((model) => {
              const colors = getModelColor(model.id);
              const isSelected = selectedModels.some((m) => m.id === model.id);
              
              return (
                <Box
                  key={model.id}
                  p={4}
                  border="1px solid"
                  borderColor={colors.border}
                  borderRadius="xl"
                  bg={isSelected ? colors.bg : hoverBg}
                  cursor="pointer"
                  onClick={() => handleToggleModel(model)}
                  position="relative"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    borderColor: colors.border,
                  }}
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bg: colors.bg,
                    opacity: isSelected ? 0.1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <Flex align="center" gap={3}>
                    <Icon 
                      as={colors.icon} 
                      boxSize={6} 
                      color={isSelected ? 'white' : colors.border}
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <Text 
                        fontWeight="semibold" 
                        color={isSelected ? 'white' : colors.border}
                      >
                        {model.name}
                      </Text>
                      <Flex gap={2} align="center">
                        <Badge 
                          colorScheme={model.provider === 'google' ? 'blue' : 
                                     model.provider === 'mistral' ? 'purple' :
                                     model.provider === 'cohere' ? 'pink' : 'green'}
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                        >
                          {model.provider}
                        </Badge>
                        {model.isPaid && (
                          <Badge 
                            colorScheme="yellow" 
                            variant="subtle"
                            borderRadius="full"
                            px={2}
                          >
                            Premium
                          </Badge>
                        )}
                      </Flex>
                    </VStack>
                    <Checkbox
                      isChecked={isSelected}
                      onChange={() => handleToggleModel(model)}
                      isDisabled={!model.isAvailable}
                      colorScheme="green"
                      pointerEvents="none"
                      size="lg"
                    />
                  </Flex>
                </Box>
              );
            })}
          </VStack>
        </ModalBody>
        <Flex 
          p={6} 
          borderTop="1px solid" 
          borderColor="whiteAlpha.200" 
          bg="rgba(18, 18, 18, 0.95)"
        >
          <Button
            w="100%"
            onClick={handleCreate}
            bg="linear-gradient(135deg, #00ff00 0%, #00cc00 100%)"
            color="black"
            fontWeight="bold"
            size="lg"
            _hover={{
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 20px rgba(0, 255, 0, 0.2)',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
          >
            Create Chat
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}; 