import axios from 'axios';
import type { Message, AIModel } from '../types';

interface AIResponse {
  content: string;
  modelId: string;
}

type Provider = 'openai' | 'anthropic' | 'google' | 'mistral' | 'cohere' | 'ollama' | 'huggingface' | 'local';

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

  async sendMessage(
    message: string,
    model: AIModel,
    context: Message[] = []
  ): Promise<AIResponse> {
    try {
      switch (model.provider) {
        case 'openai':
          return this.sendToOpenAI(message, model, context);
        case 'anthropic':
          return this.sendToAnthropic(message, model, context);
        case 'google':
          return this.sendToGoogle(message, model, context);
        case 'mistral':
          return this.sendToMistral(message, model, context);
        case 'cohere':
          return this.sendToCohere(message, model, context);
        case 'ollama':
          return this.sendToOllama(message, model, context);
        case 'huggingface':
          return this.sendToHuggingFace(message, model, context);
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
    context: Message[]
  ): Promise<AIResponse> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model.model,
        messages: [
          ...context.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
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
    context: Message[]
  ): Promise<AIResponse> {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: model.model,
        messages: [
          ...context.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
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
    context: Message[]
  ): Promise<AIResponse> {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [
          ...context.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.content }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ],
      },
      {
        headers: {
          'x-goog-api-key': this.getApiKey('google'),
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.candidates[0].content.parts[0].text,
      modelId: model.id,
    };
  }

  private async sendToMistral(
    message: string,
    model: AIModel,
    context: Message[]
  ): Promise<AIResponse> {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: model.model,
        messages: [
          ...context.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${this.getApiKey('mistral')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
      modelId: model.id,
    };
  }

  private async sendToCohere(
    message: string,
    model: AIModel,
    context: Message[]
  ): Promise<AIResponse> {
    try {
      // Map our model IDs to Cohere's model names
      const modelMap: Record<string, string> = {
        'command': 'command',
        'command-light': 'command-light',
        'command-r': 'command-r',
        'command-r-plus': 'command-r-plus'
      };

      const cohereModel = modelMap[model.id] || 'command';

      // Format chat history for Cohere
      const chatHistory = context.map((msg) => ({
        role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
        message: msg.content,
      }));

      // First, check if the model is available
      const checkResponse = await axios.get(
        'https://api.cohere.ai/v1/models',
        {
          headers: {
            'Authorization': `Bearer ${this.getApiKey('cohere')}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const availableModels = checkResponse.data.models;
      if (!availableModels.includes(cohereModel)) {
        throw new Error(`Model ${cohereModel} is not available. Please try a different model.`);
      }

      // Now send the chat message
      const response = await axios.post(
        'https://api.cohere.ai/v1/chat',
        {
          model: cohereModel,
          message: message,
          chat_history: chatHistory,
          temperature: 0.7,
          max_tokens: 100,
          p: 0.9,
          stream: false,
          connectors: [],
          prompt_truncation: 'AUTO',
          search_queries_only: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.getApiKey('cohere')}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000 // 30 second timeout
        }
      );

      if (!response.data.text) {
        throw new Error('No response generated');
      }

      return {
        content: response.data.text,
        modelId: model.id,
      };
    } catch (error) {
      console.error('Cohere API error:', error);
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('Invalid API key. Please check your Cohere API key in settings.');
        }
        if (error.message.includes('403')) {
          throw new Error('Access denied. Please check your API key permissions.');
        }
        if (error.message.includes('404')) {
          throw new Error('Model not found. Please try a different model.');
        }
        if (error.message.includes('429')) {
          throw new Error('Rate limit exceeded. Please try again in a few seconds.');
        }
        if (error.message.includes('timeout')) {
          throw new Error('Request timed out. Please try again.');
        }
      }
      throw new Error(`Cohere API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async sendToOllama(
    message: string,
    model: AIModel,
    context: Message[]
  ): Promise<AIResponse> {
    const baseUrl = model.baseUrl || 'http://localhost:11434';
    const response = await axios.post(
      `${baseUrl}/api/chat`,
      {
        model: model.model,
        messages: [
          ...context.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
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
    context: Message[]
  ): Promise<AIResponse> {
    try {
      // First, check if the model is loaded
      await axios.post(
        `https://api-inference.huggingface.co/models/${model.model}`,
        {
          inputs: "Hello",
          options: {
            wait_for_model: true,
            use_cache: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.getApiKey('huggingface')}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000 // 30 second timeout for model loading
        }
      );

      // Now send the actual message
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model.model}`,
        {
          inputs: message,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
            do_sample: true
          },
          options: {
            use_cache: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.getApiKey('huggingface')}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000 // 30 second timeout for inference
        }
      );

      // Handle different response formats
      let generatedText = '';
      if (Array.isArray(response.data)) {
        generatedText = response.data[0].generated_text || '';
      } else if (typeof response.data === 'string') {
        generatedText = response.data;
      } else if (response.data.generated_text) {
        generatedText = response.data.generated_text;
      }

      if (!generatedText) {
        throw new Error('No response generated');
      }

      return {
        content: generatedText,
        modelId: model.id,
      };
    } catch (error) {
      console.error('HuggingFace API error:', error);
      if (error instanceof Error) {
        if (error.message.includes('503')) {
          throw new Error('Model is currently loading. Please try again in a few seconds.');
        }
        if (error.message.includes('timeout')) {
          throw new Error('Request timed out. The model might be too large or the server might be busy.');
        }
        if (error.message.includes('401')) {
          throw new Error('Invalid API key. Please check your HuggingFace API key in settings.');
        }
      }
      throw new Error(`HuggingFace API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const aiService = AIService.getInstance(); 