import React from 'react';
import { 
  VStack, 
  Box, 
  Button, 
  Text, 
  Divider, 
  useDisclosure, 
  IconButton,
  Flex,
  Icon,
  Tooltip,
  Badge,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Heading,
  HStack,
} from '@chakra-ui/react';
import { FiSettings, FiPlus, FiMessageSquare, FiCpu, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { useChatStore } from '../store/chatStore';
import { ModelSelector } from './ModelSelector';
import { Settings } from './Settings';
import type { AIModel } from '../types';

export const Sidebar = () => {
  const { chats, activeChat, setActiveChat, createChat, deleteChat, availableModels } = useChatStore();
  const { isOpen: isModelSelectorOpen, onOpen: onModelSelectorOpen, onClose: onModelSelectorClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [chatToDelete, setChatToDelete] = React.useState<string | null>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.800', 'white');

  const handleCreateChat = (selectedModels: typeof availableModels) => {
    const chatName = `Chat ${chats.length + 1}`;
    createChat(chatName, selectedModels);
    onModelSelectorClose();
  };

  const handleDeleteChat = (chatId: string) => {
    setChatToDelete(chatId);
    onDeleteDialogOpen();
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete);
      if (activeChat?.id === chatToDelete) {
        setActiveChat(null);
      }
      onDeleteDialogClose();
      setChatToDelete(null);
    }
  };

  return (
    <Box
      w="300px"
      h="100vh"
      borderRight="1px solid"
      borderColor={borderColor}
      bg={bgColor}
      p={4}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="md" mb={2} color={headingColor}>
          AetherNet
        </Heading>

        <Button
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="green"
          variant="solid"
          onClick={onModelSelectorOpen}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          transition="all 0.2s"
        >
          New Chat
        </Button>

        <VStack spacing={2} align="stretch" overflowY="auto" maxH="calc(100vh - 200px)">
          {chats.map((chat) => (
            <Box
              key={chat.id}
              p={3}
              borderRadius="md"
              bg={activeChat?.id === chat.id ? 'green.50' : 'transparent'}
              border="1px solid"
              borderColor={activeChat?.id === chat.id ? 'green.200' : borderColor}
              cursor="pointer"
              _hover={{
                bg: hoverBg,
                transform: 'translateX(4px)',
              }}
              transition="all 0.2s"
              onClick={() => setActiveChat(chat)}
            >
              <Flex justify="space-between" align="center">
                <HStack spacing={2}>
                  <Icon as={FiMessageSquare} color="green.500" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium" color={textColor}>{chat.name}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {chat.participants.length} model{chat.participants.length !== 1 ? 's' : ''}
                    </Text>
                  </VStack>
                </HStack>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <MenuList>
                    <MenuItem
                      icon={<FiTrash2 />}
                      color="red.500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                    >
                      Delete Chat
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <Flex gap={2} wrap="wrap" mt={2}>
                {chat.participants.map((model: AIModel) => (
                  <Badge
                    key={model.id}
                    colorScheme="green"
                    variant="subtle"
                    fontSize="xs"
                  >
                    {model.name}
                  </Badge>
                ))}
              </Flex>
            </Box>
          ))}
        </VStack>
      </VStack>

      <ModelSelector
        isOpen={isModelSelectorOpen}
        onClose={onModelSelectorClose}
        onSelect={handleCreateChat}
        availableModels={availableModels}
      />
      <Settings isOpen={isSettingsOpen} onClose={onSettingsClose} />

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={bgColor}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color={headingColor}>
              Delete Chat
            </AlertDialogHeader>

            <AlertDialogBody color={textColor}>
              Are you sure you want to delete this chat? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}; 