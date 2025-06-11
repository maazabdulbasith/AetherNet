export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'mistral' | 'cohere' | 'ollama' | 'huggingface' | 'local';
  model: string;
  isAvailable: boolean;
  isPaid: boolean;
  isLocal?: boolean;
  baseUrl?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  modelId?: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  participants: AIModel[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: 'free' | 'premium';
} 