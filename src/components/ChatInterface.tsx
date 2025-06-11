import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Flex,
  useColorModeValue,
  IconButton,
  Heading,
  SimpleGrid,
  Icon,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  Badge,
  List,
  ListItem,
  InputGroup,
  InputRightElement,
  useColorMode,
  Avatar,
  Card,
  Link,
} from '@chakra-ui/react';
import { FiSend, FiPlus, FiArrowLeft, FiMessageSquare, FiCpu, FiUsers, FiX, FiGithub, FiLinkedin } from 'react-icons/fi';
import { useChatStore } from '../store/chatStore';
import type { Message, AIModel } from '../types';
import { aiService } from '../services/aiService';
import { ModelInfoDialog } from './ModelInfoDialog';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIResponse {
  content: string;
  modelId: string;
}

const ModelSelectionModal = ({ isOpen, onClose, onStartChat }: { 
  isOpen: boolean; 
  onClose: () => void;
  onStartChat: (selectedModels: AIModel[]) => void;
}) => {
  const { availableModels } = useChatStore();
  const [selectedModels, setSelectedModels] = useState<AIModel[]>([]);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const toggleModel = (model: AIModel) => {
    setSelectedModels(prev => 
      prev.some(m => m.id === model.id)
        ? prev.filter(m => m.id !== model.id)
        : [...prev, model]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>Select AI Models</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {availableModels.map((model) => (
              <Box
                key={model.id}
                p={4}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="md"
                cursor="pointer"
                onClick={() => toggleModel(model)}
                bg={selectedModels.some(m => m.id === model.id) ? hoverBg : 'transparent'}
                _hover={{ bg: hoverBg }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Heading size="sm">{model.name}</Heading>
                    <HStack>
                      <Badge colorScheme="green">{model.provider}</Badge>
                      {model.isPaid && <Badge colorScheme="purple">Paid</Badge>}
                    </HStack>
                  </VStack>
                  <Checkbox
                    isChecked={selectedModels.some(m => m.id === model.id)}
                    onChange={() => toggleModel(model)}
                  />
                </Flex>
              </Box>
            ))}
          </VStack>
          <Button
            mt={6}
            colorScheme="green"
            isDisabled={selectedModels.length === 0}
            onClick={() => {
              onStartChat(selectedModels);
              onClose();
            }}
            w="full"
          >
            Start Chat with {selectedModels.length} Model{selectedModels.length !== 1 ? 's' : ''}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const LandingPage = () => {
  const { isOpen: isModelSelectorOpen, onOpen: onModelSelectorOpen, onClose: onModelSelectorClose } = useDisclosure();
  const { isOpen: isModelInfoOpen, onOpen: onModelInfoOpen, onClose: onModelInfoClose } = useDisclosure();
  const { createChat, availableModels } = useChatStore();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const gradientStart = useColorModeValue('green.400', 'green.500');
  const gradientEnd = useColorModeValue('blue.400', 'blue.500');
  const currentYear = new Date().getFullYear();
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const linkColor = useColorModeValue('brand.soft.500', 'brand.soft.400');
  const hoverColor = useColorModeValue('brand.soft.600', 'brand.soft.300');

  const handleStartChat = (selectedModels: AIModel[]) => {
    createChat('New Chat', selectedModels);
  };

  return (
    <VStack
      h="full"
      w="full"
      spacing={8}
      p={8}
      position="relative"
      pb="200px"
    >
      <VStack spacing={6} maxW="800px" textAlign="center">
        <Heading
          size="2xl"
          bgGradient="linear(to-r, brand.soft.500, brand.ocean.500)"
          bgClip="text"
          _dark={{
            bgGradient: 'linear(to-r, brand.soft.400, brand.ocean.400)',
          }}
        >
          Welcome to AetherNet
        </Heading>
        <Text fontSize="xl" color={textColor}>
          Your AI-powered chat platform for seamless conversations with multiple AI models.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} maxW="800px" w="full">
        <Card
          p={6}
          bg="white"
          _dark={{ bg: 'gray.800' }}
          shadow="lg"
          _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
          transition="all 0.2s"
          cursor="pointer"
          onClick={onModelSelectorOpen}
        >
          <VStack spacing={4} align="start">
            <Icon as={FiMessageSquare} w={8} h={8} color="brand.soft.500" />
            <Heading size="md">Start a New Chat</Heading>
            <Text color={textColor}>
              Begin a conversation with your chosen AI models. Select multiple models for a group chat experience.
            </Text>
          </VStack>
        </Card>

        <Card
          p={6}
          bg="white"
          _dark={{ bg: 'gray.800' }}
          shadow="lg"
          _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
          transition="all 0.2s"
          cursor="pointer"
          onClick={onModelInfoOpen}
        >
          <VStack spacing={4} align="start">
            <Icon as={FiCpu} w={8} h={8} color="brand.ocean.500" />
            <Heading size="md">Available Models</Heading>
            <Text color={textColor}>
              Explore our collection of AI models, each with unique capabilities and specialties.
            </Text>
          </VStack>
        </Card>
      </SimpleGrid>

      <VStack
        spacing={4}
        w="full"
        maxW="800px"
        pt={8}
        borderTop="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        position="absolute"
        bottom={8}
        left="50%"
        transform="translateX(-50%)"
      >
        <Text fontSize="sm" color={textColor}>
          Developed by Abdul Basith Maaz
        </Text>
        <HStack spacing={4}>
          <Link
            href="https://linkedin.com/in/abdul-basith-maaz"
            isExternal
            color={linkColor}
            _hover={{ color: hoverColor }}
            transition="color 0.2s"
          >
            <Icon as={FiLinkedin} w={5} h={5} />
          </Link>
          <Link
            href="https://github.com/maazabdulbasith"
            isExternal
            color={linkColor}
            _hover={{ color: hoverColor }}
            transition="color 0.2s"
          >
            <Icon as={FiGithub} w={5} h={5} />
          </Link>
        </HStack>
        <Text fontSize="xs" color={textColor}>
          © {currentYear} AetherNet. All rights reserved.
        </Text>
      </VStack>

      <ModelSelectionModal
        isOpen={isModelSelectorOpen}
        onClose={onModelSelectorClose}
        onStartChat={handleStartChat}
      />
      <ModelInfoDialog
        isOpen={isModelInfoOpen}
        onClose={onModelInfoClose}
        availableModels={availableModels}
      />
    </VStack>
  );
};

const ChatInterface: React.FC = () => {
  const { activeChat, setActiveChat, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { colorMode, setColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const messageBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const codeBg = useColorModeValue('gray.100', 'gray.800');
  const userMessageBg = useColorModeValue('brand.soft.100', 'brand.soft.900');
  const userMessageText = useColorModeValue('brand.soft.900', 'brand.soft.100');
  const inputBg = useColorModeValue('white', 'gray.800');
  const inputBorder = useColorModeValue('gray.200', 'gray.700');
  const sendButtonBg = useColorModeValue('brand.soft.400', 'brand.soft.500');
  const sendButtonHover = useColorModeValue('brand.soft.500', 'brand.soft.400');
  const mentionBg = useColorModeValue('brand.soft.50', 'brand.soft.900');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const query = value.slice(lastAtIndex + 1);
      setMentionQuery(query);
      setShowMentions(true);
      setSelectedMentionIndex(0);
    } else {
      setShowMentions(false);
    }
  };

  const filteredModels = activeChat?.participants.filter(model =>
    model.name.toLowerCase().includes(mentionQuery.toLowerCase())
  ) || [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < filteredModels.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && filteredModels.length > 0) {
        e.preventDefault();
        const selectedModel = filteredModels[selectedMentionIndex];
        const lastAtIndex = input.lastIndexOf('@');
        const newInput = input.slice(0, lastAtIndex) + `@${selectedModel.name} `;
        setInput(newInput);
        setShowMentions(false);
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    }
  };

  const handleMentionClick = (model: AIModel) => {
    const lastAtIndex = input.lastIndexOf('@');
    const newInput = input.slice(0, lastAtIndex) + `@${model.name} `;
    setInput(newInput);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    // Check for mentions
    const mentions = activeChat.participants.filter(model => 
      input.includes(`@${model.name}`)
    );
    const modelsToRespond = mentions.length > 0 ? mentions : activeChat.participants;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    addMessage(activeChat.id, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const responses = await Promise.all(
        modelsToRespond.map(async (model: AIModel) => {
          const response: AIResponse = await aiService.sendMessage(input, model);
          return {
            id: Date.now().toString() + model.id,
            content: response.content,
            sender: model.id,
            timestamp: new Date(),
          };
        })
      );

      responses.forEach((response: Message) => {
        addMessage(activeChat.id, response);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, there was an error processing your message.',
        sender: 'system',
        timestamp: new Date(),
      };
      addMessage(activeChat.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const model = activeChat?.participants.find((p: AIModel) => p.id === message.sender);
    const modelColor = model?.provider === 'google' ? 'blue.500' :
                      model?.provider === 'mistral' ? 'purple.500' :
                      model?.provider === 'cohere' ? 'pink.500' : 'green.500';

    return (
      <Box
        key={message.id}
        alignSelf={isUser ? 'flex-end' : 'flex-start'}
        maxW="80%"
        bg={isUser ? userMessageBg : messageBg}
        p={4}
        borderRadius="lg"
        boxShadow="sm"
        border="1px solid"
        borderColor={isUser ? 'brand.soft.200' : borderColor}
      >
        <VStack align="start" spacing={2}>
          <HStack spacing={2}>
            <Icon
              as={isUser ? FiUsers : FiCpu}
              color={isUser ? 'brand.soft.500' : modelColor}
            />
            <Text fontWeight="medium" color={isUser ? 'brand.soft.700' : modelColor}>
              {isUser ? 'You' : model?.name}
            </Text>
          </HStack>
          <Box
            w="full"
            color={isUser ? userMessageText : textColor}
            sx={{
              '& pre': {
                bg: codeBg,
                p: 4,
                borderRadius: 'md',
                overflowX: 'auto',
                my: 2,
              },
              '& code': {
                fontFamily: 'mono',
                fontSize: 'sm',
                color: isUser ? userMessageText : textColor,
              },
              '& p': {
                mb: 2,
              },
              '& ul, & ol': {
                pl: 6,
                mb: 2,
              },
              '& li': {
                mb: 1,
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                fontWeight: 'bold',
                mb: 2,
                mt: 4,
                color: isUser ? userMessageText : textColor,
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: isUser ? 'brand.soft.300' : 'gray.300',
                pl: 4,
                py: 1,
                my: 2,
                fontStyle: 'italic',
              },
            }}
          >
            <ReactMarkdown
              components={{
                code({ className, children }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <Box
                      as="pre"
                      bg={codeBg}
                      p={4}
                      borderRadius="md"
                      overflowX="auto"
                      my={2}
                    >
                      <Box
                        as={SyntaxHighlighter}
                        language={match[1]}
                        style={vscDarkPlus}
                      >
                        {String(children).replace(/\n$/, '')}
                      </Box>
                    </Box>
                  ) : (
                    <code className={className}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </Box>
        </VStack>
      </Box>
    );
  };

  if (!activeChat) {
    return <LandingPage />;
  }

  return (
    <VStack h="full" spacing={0} bg={bgColor}>
      {activeChat && (
        <Flex
          w="full"
          p={4}
          borderBottom="1px solid"
          borderColor={borderColor}
          bg={messageBg}
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack spacing={4}>
            <IconButton
              aria-label="Back to chats"
              icon={<Icon as={FiArrowLeft} />}
              variant="ghost"
              colorScheme="brand.soft"
              onClick={() => setActiveChat(null)}
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="lg">
                {activeChat.name}
              </Text>
              <HStack spacing={2}>
                {activeChat.participants.map((model: AIModel) => (
                  <HStack key={model.id} spacing={1}>
                    <Text fontSize="sm" color="gray.500">
                      {model.name}
                    </Text>
                    <IconButton
                      aria-label={`Remove ${model.name}`}
                      icon={<Icon as={FiX} />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        const updatedChat = {
                          ...activeChat,
                          participants: activeChat.participants.filter(p => p.id !== model.id)
                        };
                        setActiveChat(updatedChat);
                      }}
                    />
                  </HStack>
                ))}
              </HStack>
            </VStack>
          </HStack>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="brand.soft"
            variant="outline"
            onClick={onOpen}
          >
            Add Model
          </Button>
        </Flex>
      )}

      <VStack flex={1} w="full" overflowY="auto" p={4} spacing={4}>
        {activeChat?.messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </VStack>

      <Box w="full" p={4} bg={messageBg} borderTop="1px solid" borderColor={borderColor} position="relative">
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (use @ to mention specific models)"
              bg={inputBg}
              borderColor={inputBorder}
              _hover={{ borderColor: 'brand.soft.400' }}
              _focus={{ borderColor: 'brand.soft.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-soft-500)' }}
            />
            <InputRightElement>
              <IconButton
                aria-label="Send message"
                icon={<Icon as={FiSend} />}
                colorScheme="brand.soft"
                bg={sendButtonBg}
                _hover={{ bg: sendButtonHover }}
                type="submit"
                isDisabled={!input.trim()}
              />
            </InputRightElement>
          </InputGroup>
        </form>

        {showMentions && filteredModels.length > 0 && (
          <Box
            position="absolute"
            bottom="100%"
            left={4}
            right={4}
            mb={2}
            bg={messageBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="md"
            boxShadow="lg"
            zIndex={1}
          >
            <List spacing={0}>
              {filteredModels.map((model: AIModel, index: number) => (
                <ListItem
                  key={model.id}
                  p={2}
                  cursor="pointer"
                  bg={index === selectedMentionIndex ? mentionBg : 'transparent'}
                  _hover={{ bg: mentionBg }}
                  onClick={() => handleMentionClick(model)}
                >
                  <HStack>
                    <Icon
                      as={FiCpu}
                      color={
                        model.provider === 'google' ? 'blue.500' :
                        model.provider === 'mistral' ? 'purple.500' :
                        model.provider === 'cohere' ? 'pink.500' : 'green.500'
                      }
                    />
                    <Text>{model.name}</Text>
                  </HStack>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>

      <ModelSelectionModal
        isOpen={isOpen}
        onClose={onClose}
        onStartChat={(selectedModels) => {
          const updatedChat = {
            ...activeChat,
            participants: [...activeChat.participants, ...selectedModels],
          };
          setActiveChat(updatedChat);
        }}
      />
    </VStack>
  );
};

export default ChatInterface; 