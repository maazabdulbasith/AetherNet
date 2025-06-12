# AetherNet

A modern AI-powered chat platform for seamless conversations with multiple AI models.

## Features

- **Group Chat:** Chat with multiple AI models simultaneously.
- **Dynamic Icons:** Each AI model has a unique icon based on its provider.
- **Theme Toggle:** Switch between light and dark modes.
- **Markdown Support:** Render markdown and code snippets with syntax highlighting.
- **Dockerized:** Easy deployment using Docker and Docker Compose.

## Tech Stack

- **Frontend:** React, Chakra UI, TypeScript
- **Backend:** Node.js, Express
- **AI Models:** Google, Mistral, Cohere
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- Git

### Local Development

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/AetherNet-web.git
   cd AetherNet-web
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     GOOGLE_API_KEY=your_google_api_key
     MISTRAL_API_KEY=your_mistral_api_key
     COHERE_API_KEY=your_cohere_api_key
     ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

### Docker Deployment

1. **Build and run the Docker containers:**
   ```sh
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment. The workflow:

- Builds Docker images for the frontend and backend.
- Pushes the images to Docker Hub.
- Runs on every push to the `master` branch and on pull requests.

### GitHub Actions Workflow

The workflow file is located at `.github/workflows/docker-build.yml`.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

- **Developer:** Abdul Basith Maaz
- **GitHub:** [maazabdulbasith](https://github.com/maazabdulbasith)
- **LinkedIn:** [Abdul Basith Maaz](https://linkedin.com/in/abdul-basith-maaz)
