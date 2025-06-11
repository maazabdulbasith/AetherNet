import { useState, useRef, useEffect } from 'react';
import { Box, VStack, HStack, Input, Button, Text, Flex, useToast } from '@chakra-ui/react';
import { useChatStore } from '../store/chatStore';
import { aiService } from '../services/aiService';
import type { Message } from '../types';

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

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeChat, addMessage } = useChatStore();
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeChat || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    addMessage(activeChat.id, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to all participants in the chat
      const responses = await Promise.all(
        activeChat.participants.map(async (model) => {
          try {
            const response = await aiService.sendMessage(
              input,
              model,
              activeChat.messages
            );
            return {
              id: crypto.randomUUID(),
              content: response.content,
              role: 'assistant' as const,
              timestamp: new Date(),
              modelId: model.id,
            };
          } catch (error) {
            console.error(`Error from ${model.name}:`, error);
            return {
              id: crypto.randomUUID(),
              content: `Error: ${model.name} is currently unavailable.`,
              role: 'assistant' as const,
              timestamp: new Date(),
              modelId: model.id,
            };
          }
        })
      );

      // Add all responses to the chat
      responses.forEach((response) => {
        addMessage(activeChat.id, response);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeChat) {
    return (
      <Box p={4} textAlign="center" h="calc(100vh - 60px)">
        <Text>Select a chat or create a new one to start messaging</Text>
      </Box>
    );
  }

  return (
    <VStack h="calc(100vh - 60px)" spacing={0}>
      <Box
        w="100%"
        h="calc(100vh - 140px)"
        overflowY="auto"
        p={4}
        bg="brand.background"
      >
        {activeChat.messages.map((message) => (
          <Flex
            key={message.id}
            justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
            mb={4}
          >
            <Box
              maxW="70%"
              bg={message.role === 'user' ? 'brand.cardBg' : 'brand.cardBg'}
              color={message.role === 'user' ? 'brand.primary' : getModelColor(message.modelId || '')}
              p={3}
              borderRadius="lg"
              boxShadow="sm"
              border="1px solid"
              borderColor={message.role === 'user' ? 'brand.primary' : getModelColor(message.modelId || '')}
            >
              <Text>{message.content}</Text>
              <Text fontSize="xs" color={message.role === 'user' ? 'brand.primaryDark' : `${getModelColor(message.modelId || '')}80`}>
                {message.modelId
                  ? `${activeChat.participants.find((p) => p.id === message.modelId)?.name} • `
                  : ''}
                {new Date(message.timestamp).toLocaleTimeString()}
              </Text>
            </Box>
          </Flex>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <HStack
        w="100%"
        h="80px"
        p={4}
        bg="brand.cardBg"
        borderTop="1px"
        borderColor="brand.primary"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          isDisabled={isLoading}
        />
        <Button
          onClick={handleSend}
          isLoading={isLoading}
          loadingText="Sending..."
        >
          Send
        </Button>
      </HStack>
    </VStack>
  );
}; 