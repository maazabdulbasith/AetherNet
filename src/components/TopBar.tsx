import {
  Box,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiSun, FiMoon } from 'react-icons/fi';
import { useState } from 'react';
import { useChatStore } from '../store/chatStore';

export const TopBar = () => {
  const { activeChat, chats, setActiveChat } = useChatStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newName, setNewName] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  const handleEditName = () => {
    if (!activeChat) return;
    setNewName(activeChat.name);
    onOpen();
  };

  const handleSaveName = () => {
    if (!activeChat || !newName.trim()) return;
    
    const updatedChats = chats.map(chat => 
      chat.id === activeChat.id 
        ? { ...chat, name: newName.trim() }
        : chat
    );
    
    setActiveChat({ ...activeChat, name: newName.trim() });
    onClose();
  };

  if (!activeChat) return null;

  const formatParticipants = () => {
    const names = activeChat.participants.map(p => p.name);
    if (names.length === 0) return 'New Chat';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names[0]}, ${names[1]} and ${names.length - 2} others`;
  };

  return (
    <>
      <Box
        h="60px"
        borderBottom="1px"
        borderColor="brand.primary"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={4}
        bg="brand.cardBg"
      >
        <Text fontSize="lg" fontWeight="medium" noOfLines={1}>
          {activeChat.name || formatParticipants()}
        </Text>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
          />
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              aria-label="Chat options"
            />
            <MenuList>
              <MenuItem icon={<FiEdit2 />} onClick={handleEditName}>
                Edit Chat Name
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Chat Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new chat name"
              />
              <Button onClick={handleSaveName} w="100%">
                Save
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}; 