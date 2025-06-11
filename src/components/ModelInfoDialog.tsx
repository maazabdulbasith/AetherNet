import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Image,
  Box,
  SimpleGrid,
  Badge,
  useColorModeValue,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiCpu, FiZap, FiMessageSquare } from 'react-icons/fi';
import type { AIModel } from '../types';

interface ModelInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableModels: AIModel[];
}

const getModelInfo = (modelId: string) => {
  switch (modelId) {
    case 'gemini-pro':
      return {
        logo: 'https://www.gstatic.com/lamda/images/favicon_v1_150160c3f2947e294.svg',
        description: 'Google\'s most capable AI model, designed for complex reasoning and creative tasks.',
        capabilities: [
          'Advanced reasoning and problem-solving',
          'Creative content generation',
          'Code understanding and generation',
          'Multilingual support',
          'Real-time information processing'
        ],
        icon: FiZap
      };
    case 'mistral-medium':
      return {
        logo: 'https://mistral.ai/favicon.ico',
        description: 'Mistral\'s powerful language model optimized for efficiency and performance.',
        capabilities: [
          'Efficient text generation',
          'Contextual understanding',
          'Code assistance',
          'Multilingual capabilities',
          'Fast response times'
        ],
        icon: FiCpu
      };
    case 'cohere-command-r-plus':
      return {
        logo: 'https://cohere.com/favicon.ico',
        description: 'Cohere\'s advanced language model focused on enterprise applications.',
        capabilities: [
          'Enterprise-grade performance',
          'Advanced reasoning',
          'Document understanding',
          'Multi-step task completion',
          'Robust API integration'
        ],
        icon: FiMessageSquare
      };
    case 'HuggingFaceH4/zephyr-7b-beta':
      return {
        logo: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
        description: 'An open-source model fine-tuned for chat and instruction following. Best suited for one-on-one conversations.',
        capabilities: [
          'Open-source and customizable',
          'Efficient chat interactions',
          'Instruction following',
          'Community-driven improvements',
          'Local deployment possible'
        ],
        limitations: [
          'Slower response times compared to commercial models',
          'May hallucinate or generate incorrect information',
          'Best performance in one-on-one conversations',
          'Limited context window compared to larger models',
          'May struggle with complex multi-step reasoning'
        ],
        icon: FiCpu
      };
    default:
      return {
        logo: '',
        description: 'A powerful AI model for various tasks.',
        capabilities: ['General purpose AI'],
        icon: FiCpu
      };
  }
};

export const ModelInfoDialog = ({ isOpen, onClose, availableModels }: ModelInfoDialogProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.800', 'white');
  const warningColor = useColorModeValue('orange.600', 'orange.300');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} border="1px solid" borderColor={borderColor}>
        <ModalHeader color={headingColor}>Available AI Models</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {availableModels.map((model) => {
              const info = getModelInfo(model.id);
              return (
                <Box
                  key={model.id}
                  p={4}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="lg"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  <VStack align="start" spacing={4}>
                    <Flex align="center" gap={3}>
                      <Box
                        boxSize="40px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg={model.provider === 'google' ? 'blue.50' :
                            model.provider === 'mistral' ? 'purple.50' :
                            model.provider === 'cohere' ? 'pink.50' : 'green.50'}
                        borderRadius="md"
                        p={2}
                      >
                        <Image
                          src={info.logo}
                          alt={`${model.name} logo`}
                          boxSize="full"
                          objectFit="contain"
                          fallback={
                            <Icon
                              as={info.icon}
                              boxSize="24px"
                              color={
                                model.provider === 'google' ? 'blue.500' :
                                model.provider === 'mistral' ? 'purple.500' :
                                model.provider === 'cohere' ? 'pink.500' : 'green.500'
                              }
                            />
                          }
                        />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" color={headingColor}>
                          {model.name}
                        </Text>
                        <Badge colorScheme={
                          model.provider === 'google' ? 'blue' :
                          model.provider === 'mistral' ? 'purple' :
                          model.provider === 'cohere' ? 'pink' : 'green'
                        }>
                          {model.provider}
                        </Badge>
                      </VStack>
                    </Flex>
                    <Text color={textColor}>{info.description}</Text>
                    <Box w="full">
                      <Text fontWeight="semibold" mb={2} color={headingColor}>
                        Capabilities:
                      </Text>
                      <VStack align="start" spacing={2}>
                        {info.capabilities.map((capability, index) => (
                          <Flex key={index} align="center" gap={2}>
                            <Icon as={info.icon} color="green.500" />
                            <Text color={textColor}>{capability}</Text>
                          </Flex>
                        ))}
                      </VStack>
                    </Box>
                    {info.limitations && (
                      <Box w="full">
                        <Text fontWeight="semibold" mb={2} color={warningColor}>
                          Limitations:
                        </Text>
                        <VStack align="start" spacing={2}>
                          {info.limitations.map((limitation, index) => (
                            <Flex key={index} align="center" gap={2}>
                              <Icon as={FiCpu} color={warningColor} />
                              <Text color={textColor}>{limitation}</Text>
                            </Flex>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 