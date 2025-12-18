# CareerPath AI

A premium, AI-powered career guidance web application that analyzes user skills and interests to suggest suitable career paths.

## Features

- **AI-Powered Analysis**: Integrates with Google's Gemini API for intelligent career recommendations
- **Cyberpunk Glassmorphism Design**: Modern, futuristic interface with blue color palette
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Clean Architecture**: Modular, scalable code structure with clear separation of concerns

## Getting Started

### Prerequisites

- Node.js 16+ installed
- A Google Gemini API key (optional for demo mode)

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Configure Gemini API:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   - Get your API key from: https://makersuite.google.com/app/apikey

### Development

Run the development server:
```bash
npm run dev
```

### Production Build

Build for production:
```bash
npm run build
```

## Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── Hero.tsx        # Landing page
│   ├── InputForm.tsx   # User input collection
│   ├── LoadingState.tsx # AI analysis animation
│   └── Results.tsx     # Career recommendations display
├── services/           # Business logic
│   └── ai.service.ts   # Gemini API integration
├── types/              # TypeScript definitions
│   └── career.ts       # Type definitions
├── App.tsx             # Main application component
└── index.css           # Global styles with custom design system
```

### AI Service

The AI service (`ai.service.ts`) is designed for easy API integration:

- **Injectable**: API key can be configured via environment variables or constructor
- **Fallback**: Includes mock responses for demo/testing without API key
- **Extensible**: Prompt construction and response parsing are separate methods
- **Type-Safe**: Full TypeScript support with defined interfaces

### Design System

Custom glassmorphism design system with:
- CSS custom properties for consistent theming
- Reusable utility classes (`.glass-panel`, `.cyber-button`, etc.)
- Smooth animations and transitions
- Blue/cyan color palette with neon accents

## AI Integration

The application uses Google's Gemini API for career analysis. The AI service:

1. Constructs a detailed prompt based on user interests and skills
2. Sends the request to Gemini API
3. Parses the JSON response
4. Returns structured career recommendations

**Note**: The application works without an API key by using mock data, making it perfect for demonstrations and testing.

## Customization

### Modifying AI Prompts

Edit the `constructPrompt()` method in `src/services/ai.service.ts` to customize how the AI analyzes user input.

### Changing Design Theme

Modify CSS custom properties in `src/index.css` under the `:root` selector to adjust colors and theme.

### Adding New Features

The modular architecture makes it easy to extend:
- Add new components in `src/components/`
- Extend types in `src/types/`
- Add new services in `src/services/`

## License

MIT
