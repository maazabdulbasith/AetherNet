# AetherNet

A modern, multi-model AI chat platform that allows you to interact with various AI models individually or in group conversations. Experience the power of multiple AI models working together to provide comprehensive responses.

## Features

- **Multi-Model Chat**: Chat with multiple AI models simultaneously
- **Model Selection**: Choose from various AI models including:
  - Mistral Medium
  - Command R+ (Cohere)
  - Zephyr 7B Beta (HuggingFace)
  - Gemini Pro (Google)
- **Mention System**: Use @mentions to direct questions to specific models
- **Markdown Support**: Rich text formatting and code syntax highlighting
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Theme Support**: Light and dark mode with multiple color schemes
- **Real-time Updates**: Instant message delivery and response streaming

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

3. Create a `.env` file in the root directory and add your API keys:
```env
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_MISTRAL_API_KEY=your_mistral_api_key
VITE_COHERE_API_KEY=your_cohere_api_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Starting a New Chat

1. Click "Start a New Chat" on the landing page
2. Select one or more AI models from the available options
3. Click "Start Chat" to begin your conversation

### Using Mentions

- Type '@' followed by a model name to mention a specific model
- Use arrow keys to navigate through the mention suggestions
- Press Enter to select a model
- Models will only respond when mentioned in a group chat

### Available Models

#### Free Models
- **Mistral Medium**: Powerful language model with strong reasoning capabilities
- **Command R+**: Cohere's advanced model for complex tasks
- **Zephyr 7B Beta**: Open-source model with good performance
- **Gemini Pro**: Google's latest AI model with strong capabilities

## Development

### Project Structure

```
src/
  ├── components/     # React components
  │   ├── ChatInterface.tsx    # Main chat interface
  │   ├── ModelInfoDialog.tsx  # Model information modal
  │   └── FutureVisionDialog.tsx # Future features dialog
  ├── services/      # API and service integrations
  │   └── aiService.ts         # AI model integration service
  ├── store/         # State management
  │   └── chatStore.ts         # Chat state management
  ├── types.ts       # TypeScript type definitions
  └── theme.ts       # UI theme configuration
```

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and structure
- Add TypeScript types for all new features
- Include tests for new functionality
- Update documentation as needed

## Future Plans

- Premium tier with access to advanced models
- Collaborative features for team usage
- Custom model fine-tuning
- Enhanced analytics and insights
- API access for integration with other applications

## License

This project is licensed under the Honesty License - dont ask files for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [React Icons](https://react-icons.github.io/react-icons/) for beautiful icons
