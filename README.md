# AetherNet

A WhatsApp-style chat application for interacting with various AI models. Chat with individual AI models or create group chats where multiple AIs can debate and collaborate.

## Features

- Chat with multiple AI models including GPT-4, Claude 3, Gemini, Mistral, and more
- Create group chats with multiple AI models
- Real-time message streaming
- Modern, responsive UI
- Free tier with open-source models and limited API access
- Premium tier with access to advanced models (coming soon)

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- API keys for the AI models you want to use

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AetherNet.git
cd AetherNet-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Configuration

1. Click the settings icon in the sidebar
2. Enter your API key for the AI models you want to use
3. Save the settings

## Available Models

### Free Tier
- Gemini Pro (Google)
- Mistral Medium
- Cohere Command

### Premium Tier (Coming Soon)
- GPT-4 (OpenAI)
- Claude 3 (Anthropic)
- Higher usage limits
- Priority support

## Development

### Project Structure

```
src/
  ├── components/     # React components
  ├── services/      # API and service integrations
  ├── store/         # State management
  ├── types/         # TypeScript type definitions
  └── App.tsx        # Main application component
```

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
