import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Heading,
  Text,
  Box,
  SimpleGrid,
  Icon,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiZap, FiStar, FiUsers, FiMessageSquare } from 'react-icons/fi';

interface FutureVisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureVisionDialog: React.FC<FutureVisionDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('brand.soft.600', 'brand.soft.400');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack spacing={2} align="start">
            <Heading size="lg" color={headingColor}>
              Future Vision
            </Heading>
            <Text fontSize="sm" color={textColor}>
              The roadmap for AetherNet's evolution
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={8} align="stretch">
            {/* Upcoming Features */}
            <Box>
              <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                <Icon as={FiZap} color="brand.soft.500" />
                Upcoming Features
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box p={4} bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                  <Text fontWeight="medium" mb={2}>Premium AI Models</Text>
                  <Text fontSize="sm" color={textColor}>
                    Integration with GPT-4, Claude, and other advanced models
                  </Text>
                </Box>
                <Box p={4} bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                  <Text fontWeight="medium" mb={2}>Team Collaboration</Text>
                  <Text fontSize="sm" color={textColor}>
                    Shared workspaces and real-time collaboration features
                  </Text>
                </Box>
                <Box p={4} bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                  <Text fontWeight="medium" mb={2}>API Access</Text>
                  <Text fontSize="sm" color={textColor}>
                    Developer API for custom integrations and applications
                  </Text>
                </Box>
                <Box p={4} bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                  <Text fontWeight="medium" mb={2}>Advanced Customization</Text>
                  <Text fontSize="sm" color={textColor}>
                    Custom themes, workflows, and model configurations
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Pro Plans */}
            <Box>
              <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                <Icon as={FiStar} color="brand.soft.500" />
                Pro Plans
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box p={4} bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                  <Text fontWeight="medium" mb={2}>Basic Pro</Text>
                  <Text fontSize="sm" color={textColor}>
                    Access to premium models, higher rate limits, and basic support
                  </Text>
                </Box>
                <Box p={4} bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                  <Text fontWeight="medium" mb={2}>Enterprise</Text>
                  <Text fontSize="sm" color={textColor}>
                    Custom solutions, dedicated support, and advanced features
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Collaboration */}
            <Box>
              <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                <Icon as={FiUsers} color="brand.soft.500" />
                Collaboration Opportunities
              </Heading>
              <Box p={4} bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                <Text mb={4} color={textColor}>
                    Looking for collaborators to help shape the future of AetherNet. Whether you're a developer, designer, or AI enthusiast, we'd love to hear from you.
                </Text>
                <VStack align="start" spacing={2}>
                  <Link href="https://linkedin.com/in/abdul-basith-maaz" isExternal color="brand.soft.500">
                    Connect on LinkedIn
                  </Link>
                  <Link href="https://github.com/maazabdulbasith" isExternal color="brand.soft.500">
                    Check out my GitHub
                  </Link>
                </VStack>
              </Box>
            </Box>

            {/* Community Input */}
            <Box>
              <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                <Icon as={FiMessageSquare} color="brand.soft.500" />
                Community Input
              </Heading>
              <Box p={4} bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                <Text mb={4} color={textColor}>
                  Have suggestions or feedback? We'd love to hear from you! Your input helps shape the future of AetherNet.
                </Text>
                <Link href="mailto:maazabdulbasith@gmail.com" color="brand.soft.500">
                  Send me your ideas
                </Link>
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 