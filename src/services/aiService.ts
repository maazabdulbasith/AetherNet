import axios from 'axios';
import type { Message, AIModel } from '../types';

interface APIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  modelId: string;
}

type Provider = 'openai' | 'anthropic' | 'google' | 'mistral' | 'cohere' | 'ollama' | 'huggingface' | 'local';

// Get the API base URL from environment variables
const API_BASE = import.meta.env.VITE_API_URL || '';

class AIService {
  private static instance: AIService;
  private apiKeys: Record<Provider, string | null> = {
    openai: null,
    anthropic: null,
    google: null,
    mistral: null,
    cohere: null,
    ollama: null,
    huggingface: null,
    local: null,
  };

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setApiKey(key: string, provider: Provider) {
    this.apiKeys[provider] = key;
  }

  private getApiKey(provider: Provider): string {
    const key = this.apiKeys[provider];
    if (!key && provider !== 'ollama' && provider !== 'local') {
      throw new Error(`API key not set for ${provider}`);
    }
    return key || '';
  }

  private convertToAPIMessages(messages: Message[]): APIMessage[] {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  }

  async sendMessage(
    message: string,
    model: AIModel,
    context: Message[] = []
  ): Promise<AIResponse> {
    try {
      // Create a system message that explains the group chat context
      const systemMessage: APIMessage = {
        role: 'system',
        content: `You are participating in a group chat with other AI assistants. 
        You can see their responses and should acknowledge them when relevant.
        If you agree with another assistant's response, you can say so.
        If you have a different perspective or additional information, feel free to share it.
        Work together to help the user solve their problem.`
      };

      // Add the system message to the context
      const messagesWithContext = [
        systemMessage,
        ...this.convertToAPIMessages(context)
      ];

      switch (model.provider) {
        case 'openai':
          return this.sendToOpenAI(message, model, messagesWithContext);
        case 'anthropic':
          return this.sendToAnthropic(message, model, messagesWithContext);
        case 'google':
          return this.sendToGoogle(message, model, messagesWithContext);
        case 'mistral':
          return this.sendToMistral(message, model, messagesWithContext);
        case 'cohere':
          return this.sendToCohere(message, model, messagesWithContext);
        case 'ollama':
          return this.sendToOllama(message, model, messagesWithContext);
        case 'huggingface':
          return this.sendToHuggingFace(message, model, messagesWithContext);
        default:
          throw new Error(`Unsupported provider: ${model.provider}`);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw error;
    }
  }

  private async sendToOpenAI(
    message: string,
    model: AIModel,
    context: APIMessage[]
  ): Promise<AIResponse> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model.model,
        messages: [
          ...context,
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${this.getApiKey('openai')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
      modelId: model.id,
    };
  }

  private async sendToAnthropic(
    message: string,
    model: AIModel,
    context: APIMessage[]
  ): Promise<AIResponse> {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: model.model,
        messages: [
          ...context,
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          'x-api-key': this.getApiKey('anthropic'),
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.content[0].text,
      modelId: model.id,
    };
  }

  private async sendToGoogle(
    message: string,
    model: AIModel,
    context: APIMessage[]
  ): Promise<AIResponse> {
    try {
      const response = await axios.post(`${API_BASE}/api/gemini`, {
        message,
        context,
      });

      if (!response.data || !response.data.content) {
        throw new Error('Invalid response format from Google API');
      }

      return {
        content: response.data.content,
        modelId: model.id,
      };
    } catch (error) {
      console.error('Google API error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Google API error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
        } else if (error.request) {
          throw new Error('No response received from Google API');
        }
      }
      throw new Error('Failed to communicate with Google API');
    }
  }

  private async sendToMistral(
    message: string,
    model: AIModel,
    context: APIMessage[]
  ): Promise<AIResponse> {
    try {
      const response = await axios.post(`${API_BASE}/api/mistral`, {
        message,
        context,
      });

      if (!response.data || !response.data.content) {
        throw new Error('Invalid response format from Mistral API');
      }

      return {
        content: response.data.content,
        modelId: model.id,
      };
    } catch (error) {
      console.error('Mistral API error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Mistral API error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
        } else if (error.request) {
          throw new Error('No response received from Mistral API');
        }
      }
      throw new Error('Failed to communicate with Mistral API');
    }
  }

  private async sendToCohere(
    message: string,
    model: AIModel,
    context: APIMessage[]
  ): Promise<AIResponse> {
    try {
      const response = await axios.post(`${API_BASE}/api/cohere`, {
        message,
        context,
      });

      if (!response.data || !response.data.content) {
        throw new Error('Invalid response format from Cohere API');
      }

      return {
        content: response.data.content,
        modelId: model.id,
      };
    } catch (error) {
      console.error('Cohere API error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Cohere API error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
        } else if (error.request) {
          throw new Error('No response received from Cohere API');
        }
      }
      throw new Error('Failed to communicate with Cohere API');
    }
  }

  private async sendToOllama(
    message: string,
    model: AIModel,
    context: APIMessage[]
  ): Promise<AIResponse> {
    const baseUrl = model.baseUrl || 'http://localhost:11434';
    const response = await axios.post(
      `${baseUrl}/api/chat`,
      {
        model: model.model,
        messages: [
          ...context,
          { role: 'user', content: message },
        ],
      }
    );

    return {
      content: response.data.message.content,
      modelId: model.id,
    };
  }

  private async sendToHuggingFace(
    message: string,
    model: AIModel,
    context: APIMessage[]
  ): Promise<AIResponse> {
    try {
      const response = await axios.post('/api/huggingface', {
        message,
        context,
        model: model.model,
      });

      return {
        content: response.data.content,
        modelId: model.id,
      };
    } catch (error) {
      console.error('HuggingFace API error:', error);
      if (error instanceof Error) {
        throw new Error(`HuggingFace API error: ${error.message}`);
      }
      throw new Error('Unknown error occurred');
    }
  }
}

export const aiService = AIService.getInstance();

export const sendToGoogle = async (message: string, context: string = ''): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/api/gemini`, {
      message,
      context
    });
    return response.data;
  } catch (error) {
    console.error('Google API error:', error);
    throw new Error(`Google API error: ${error.response?.status || 'Unknown error'}`);
  }
};

export const sendToMistral = async (message: string, context: string = ''): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/api/mistral`, {
      message,
      context
    });
    return response.data;
  } catch (error) {
    console.error('Mistral API error:', error);
    throw new Error(`Mistral API error: ${error.response?.status || 'Unknown error'}`);
  }
};

export const sendToCohere = async (message: string, context: string = ''): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/api/cohere`, {
      message,
      context
    });
    return response.data;
  } catch (error) {
    console.error('Cohere API error:', error);
    throw new Error(`Cohere API error: ${error.response?.status || 'Unknown error'}`);
  }
}; 