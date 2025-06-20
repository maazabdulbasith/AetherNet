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

// Health check endpoint
app.get('/', (_, res) => {
  res.send('Backend is running ✅');
});

// Configure CORS
const allowedOrigins = [
  'https://aethernet-f.onrender.com',  // Production frontend
  'http://localhost:3000',           // Local development
  'http://localhost:5173'            // Vite dev server
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Google Gemini endpoint
app.post('/gemini', async (req, res) => {
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
    const status = error.response?.status || 500;
    console.error(
      'Gemini API error:',
      JSON.stringify(error.response?.data || error.message, null, 2)
    );
    return res.status(status).json({
      error: 'Gemini API error',
      details: error.response?.data || error.message,
    });
  }
});

// HuggingFace endpoint
app.post('/huggingface', async (req, res) => {
  try {
    const { message, context, model } = req.body;

    const prompt =
      context.length > 0
        ? context
            .map((msg: any) => {
              if (msg.role === 'system') {
                return `<|system|>\n${msg.content}</s>`;
              }
              return msg.role === 'user'
                ? `<|user|>\n${msg.content}</s>`
                : `<|assistant|>\n${msg.content}</s>`;
            })
            .join('\n') + `\n<|user|>\n${message}</s>\n<|assistant|>`
        : `<|user|>\n${message}</s>\n<|assistant|>`;

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
          do_sample: true,
        },
        options: {
          wait_for_model: true,
          use_cache: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
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

    const cleanResponse = generatedText
      .replace(prompt, '')
      .replace(/<\|.*?\|>/g, '')
      .replace(/<\/s>/g, '')
      .trim();

    res.json({ content: cleanResponse });
  } catch (error: any) {
    const status = error.response?.status || 500;
    console.error(
      'HuggingFace API error:',
      JSON.stringify(error.response?.data || error.message, null, 2)
    );
    return res.status(status).json({
      error: 'HuggingFace API error',
      details: error.response?.data || error.message,
    });
  }
});

// Cohere endpoint
app.post('/cohere', async (req, res) => {
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
          Authorization: `Bearer ${process.env.COHERE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.text) {
      throw new Error('No response generated from Cohere');
    }

    res.json({ content: response.data.text });
  } catch (error: any) {
    const status = error.response?.status || 500;
    console.error(
      'Cohere API error:',
      JSON.stringify(error.response?.data || error.message, null, 2)
    );
    return res.status(status).json({
      error: 'Cohere API error',
      details: error.response?.data || error.message,
    });
  }
});

// Mistral endpoint
app.post('/mistral', async (req, res) => {
  try {
    const { message, context, model } = req.body;

    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: model || 'mistral-tiny',
        messages: [
          ...context.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.choices?.[0]?.message?.content) {
      throw new Error('No response generated from Mistral');
    }

    res.json({ content: response.data.choices[0].message.content });
  } catch (error: any) {
    const status = error.response?.status || 500;
    console.error(
      'Mistral API error:',
      JSON.stringify(error.response?.data || error.message, null, 2)
    );
    return res.status(status).json({
      error: 'Mistral API error',
      details: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});