export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'google' | 'mistral' | 'cohere' | 'huggingface';
  model: string;
  isAvailable: boolean;
  isPaid: boolean;
  avatar?: string;
  baseUrl?: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  participants: AIModel[];
  createdAt: Date;
  updatedAt: Date;
} 