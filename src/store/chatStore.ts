import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../services/aiService';
import type { Chat, Message, AIModel } from '../types';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  availableModels: AIModel[];
  setActiveChat: (chat: Chat) => void;
  addMessage: (chatId: string, message: Message) => void;
  createChat: (name: string, participants: AIModel[]) => void;
  deleteChat: (chatId: string) => void;
  updateModelBaseUrl: (modelId: string, baseUrl: string) => void;
}

const defaultModels: AIModel[] = [
  {
    id: 'mistral-medium',
    name: 'Mistral Medium',
    provider: 'mistral',
    model: 'mistral-medium',
    isAvailable: true,
    isPaid: false,
  },
  {
    id: 'ollama-llama2',
    name: 'Llama 2 (Local)',
    provider: 'ollama',
    model: 'llama2',
    isAvailable: true,
    isPaid: false,
    isLocal: true,
    baseUrl: 'http://localhost:11434',
  },
  {
    id: 'ollama-codellama',
    name: 'CodeLlama (Local)',
    provider: 'ollama',
    model: 'codellama',
    isAvailable: true,
    isPaid: false,
    isLocal: true,
    baseUrl: 'http://localhost:11434',
  },
  {
    id: 'cohere-command',
    name: 'Command',
    provider: 'cohere',
    model: 'command',
    isAvailable: true,
    isPaid: false,
  },
  {
    id: 'cohere-command-light',
    name: 'Command Light',
    provider: 'cohere',
    model: 'command-light',
    isAvailable: true,
    isPaid: false,
  },
  {
    id: 'cohere-command-r',
    name: 'Command R',
    provider: 'cohere',
    model: 'command-r',
    isAvailable: true,
    isPaid: false,
  },
  {
    id: 'cohere-command-r-plus',
    name: 'Command R+',
    provider: 'cohere',
    model: 'command-r-plus',
    isAvailable: true,
    isPaid: false,
  },
  {
    id: 'huggingface-falcon',
    name: 'Falcon',
    provider: 'huggingface',
    model: 'falcon',
    isAvailable: true,
    isPaid: false,
  },
  {
    id: 'huggingface-mistral',
    name: 'Mistral',
    provider: 'huggingface',
    model: 'mistral',
    isAvailable: true,
    isPaid: false,
  },
  {
    id: 'google-gemini',
    name: 'Gemini Pro',
    provider: 'google',
    model: 'gemini-pro',
    isAvailable: true,
    isPaid: false,
  },
];

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  availableModels: defaultModels,
  setActiveChat: (chat) => set({ activeChat: chat }),
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ),
      activeChat: state.activeChat?.id === chatId
        ? { ...state.activeChat, messages: [...state.activeChat.messages, message] }
        : state.activeChat,
    })),
  createChat: (name, participants) =>
    set((state) => {
      const newChat = {
        id: uuidv4(),
        name,
        messages: [],
        participants,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        chats: [...state.chats, newChat],
        activeChat: newChat,
      };
    }),
  deleteChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== chatId),
      activeChat: state.activeChat?.id === chatId ? null : state.activeChat,
    })),
  updateModelBaseUrl: (modelId, baseUrl) =>
    set((state) => ({
      availableModels: state.availableModels.map((model) =>
        model.id === modelId ? { ...model, baseUrl } : model
      ),
    })),
})); 