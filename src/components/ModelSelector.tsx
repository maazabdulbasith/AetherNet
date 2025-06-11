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
} from '@chakra-ui/react';
import { useState } from 'react';
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
      return 'brand.gemini';
    case 'mistral-medium':
      return 'brand.mistral';
    case 'llama2':
      return 'brand.llama';
    case 'falcon-7b':
      return 'brand.falcon';
    case 'phi-2':
      return 'brand.phi';
    case 'codellama':
      return 'brand.llama';
    default:
      return 'brand.primary';
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
      <ModalOverlay />
      <ModalContent maxH="80vh" display="flex" flexDirection="column">
        <ModalHeader>Select AI Models</ModalHeader>
        <ModalCloseButton />
        <ModalBody flex="1" overflowY="auto" pb={0}>
          <VStack spacing={4} align="stretch">
            {availableModels.map((model) => (
              <Box
                key={model.id}
                p={3}
                border="1px solid"
                borderColor={getModelColor(model.id)}
                borderRadius="md"
                bg="brand.cardBg"
              >
                <Checkbox
                  isChecked={selectedModels.some((m) => m.id === model.id)}
                  onChange={() => handleToggleModel(model)}
                  isDisabled={!model.isAvailable}
                  colorScheme="green"
                >
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium" color={getModelColor(model.id)}>
                      {model.name}
                    </Text>
                    <Text fontSize="sm" opacity={0.7}>
                      {model.provider}
                      {model.isPaid && ' (Premium)'}
                    </Text>
                  </VStack>
                </Checkbox>
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <Flex p={4} borderTop="1px" borderColor="brand.primary" bg="brand.cardBg">
          <Button
            w="100%"
            onClick={handleCreate}
          >
            Create Chat
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}; 