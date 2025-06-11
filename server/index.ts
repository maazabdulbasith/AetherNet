import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Log environment variables (without exposing full keys)
console.log('Environment check:');
console.log('GEMINI_KEY loaded:', process.env.GEMINI_KEY ? 'Yes' : 'No');
console.log('HF_KEY loaded:', process.env.HF_KEY ? 'Yes' : 'No');
console.log('MISTRAL_KEY loaded:', process.env.MISTRAL_KEY ? 'Yes' : 'No');
console.log('COHERE_KEY loaded:', process.env.COHERE_KEY ? 'Yes' : 'No');
console.log('PORT:', process.env.PORT || 4000);

const app = express();
app.use(cors());
app.use(express.json());

// Google Gemini endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    const { message, context } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`;

    const response = await axios.post(
      url,
      {
        contents: [
          ...context.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1000,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('No response generated from Gemini');
    }

    res.json({
      content: response.data.candidates[0].content.parts[0].text,
    });
  } catch (error: any) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Gemini API error',
      details: error.response?.data || error.message 
    });
  }
});

// HuggingFace endpoint
app.post('/api/huggingface', async (req, res) => {
  try {
    const { message, context, model } = req.body;
    
    const prompt = context.length > 0
      ? context.map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n') + `\nUser: ${message}\nAssistant:`
      : `User: ${message}\nAssistant:`;

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
          do_sample: true
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

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

    const cleanResponse = generatedText.replace(prompt, '').trim();
    res.json({ content: cleanResponse });
  } catch (error: any) {
    console.error('HuggingFace API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'HuggingFace API error',
      details: error.response?.data || error.message 
    });
  }
});

// Cohere endpoint
app.post('/api/cohere', async (req, res) => {
  try {
    const { message, context, model } = req.body;
    
    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        message,
        model,
        chat_history: context.map((msg: any) => ({
          role: msg.role,
          message: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.text) {
      throw new Error('No response generated from Cohere');
    }

    res.json({ content: response.data.text });
  } catch (error: any) {
    console.error('Cohere API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Cohere API error',
      details: error.response?.data || error.message 
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 