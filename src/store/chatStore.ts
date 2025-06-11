import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../services/aiService';
import type { Chat, Message, AIModel } from '../types';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  availableModels: AIModel[];
  isLoading: boolean;
  error: string | null;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  createChat: (name: string, participants: AIModel[]) => Chat;
  deleteChat: (chatId: string) => void;
  updateModelBaseUrl: (modelId: string, baseUrl: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
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
    id: 'cohere-command-r-plus',
    name: 'Command R+',
    provider: 'cohere',
    model: 'command-r-plus',
    isAvailable: true,
    isPaid: false,
  },
  {
    id: 'HuggingFaceH4/zephyr-7b-beta',
    name: 'Zephyr 7B Beta',
    provider: 'huggingface',
    model: 'HuggingFaceH4/zephyr-7b-beta',
    isAvailable: true,
    isPaid: false,
  },
  {
    id: 'gemini-pro',
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
  isLoading: false,
  error: null,
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
  createChat: (name, participants) => {
    const newChat = {
      id: uuidv4(),
      name,
      messages: [],
      participants,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      chats: [...state.chats, newChat],
      activeChat: newChat,
    }));
    return newChat;
  },
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
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 