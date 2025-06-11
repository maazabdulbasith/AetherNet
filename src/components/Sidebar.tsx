import { VStack, Box, Button, Text, Divider, useDisclosure, IconButton } from '@chakra-ui/react';
import { FiSettings } from 'react-icons/fi';
import { useChatStore } from '../store/chatStore';
import { ModelSelector } from './ModelSelector';
import { Settings } from './Settings';

export const Sidebar = () => {
  const { chats, activeChat, setActiveChat, createChat, availableModels } = useChatStore();
  const { isOpen: isModelSelectorOpen, onOpen: onModelSelectorOpen, onClose: onModelSelectorClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

  const handleCreateChat = (selectedModels: typeof availableModels) => {
    const chatName = `Chat with ${selectedModels.map(m => m.name).join(', ')}`;
    createChat(chatName, selectedModels);
    onModelSelectorClose();
  };

  return (
    <VStack
      w="300px"
      h="100vh"
      bg="brand.cardBg"
      borderRight="1px"
      borderColor="brand.primary"
      spacing={0}
    >
      <Box p={4} w="100%" display="flex" justifyContent="space-between" alignItems="center">
        <Button
          onClick={onModelSelectorOpen}
        >
          New Chat
        </Button>
        <IconButton
          aria-label="Settings"
          icon={<FiSettings />}
          variant="ghost"
          onClick={onSettingsOpen}
        />
      </Box>
      <Divider borderColor="brand.primary" />
      <VStack
        flex={1}
        w="100%"
        overflowY="auto"
        spacing={0}
      >
        {chats.map((chat) => (
          <Box
            key={chat.id}
            w="100%"
            p={4}
            cursor="pointer"
            bg={activeChat?.id === chat.id ? 'brand.primary' : 'transparent'}
            color={activeChat?.id === chat.id ? 'white' : 'brand.primary'}
            _hover={{ 
              bg: activeChat?.id === chat.id ? 'brand.primary' : 'brand.primary',
              bgOpacity: activeChat?.id === chat.id ? '1' : '0.1',
              color: activeChat?.id === chat.id ? 'white' : 'brand.primary'
            }}
            onClick={() => setActiveChat(chat)}
            borderBottom="1px"
            borderColor="brand.primary"
            transition="all 0.2s"
          >
            <Text fontWeight="medium" noOfLines={1} color="inherit">
              {chat.name}
            </Text>
            <Text fontSize="sm" opacity={activeChat?.id === chat.id ? 0.9 : 0.7} color="inherit">
              {chat.participants.map((p) => p.name).join(', ')}
            </Text>
          </Box>
        ))}
      </VStack>

      <ModelSelector
        isOpen={isModelSelectorOpen}
        onClose={onModelSelectorClose}
        onSelect={handleCreateChat}
        availableModels={availableModels}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={onSettingsClose}
      />
    </VStack>
  );
}; 