# GenAI-PolyInfer React TypeScript Example

A comprehensive React TypeScript application demonstrating all features of the `genai-polyinfer` package. This example showcases provider orchestration, caching, metrics tracking, and different execution modes in a modern React application.

## Features Demonstrated

- ✅ **Multi-Provider Orchestration**: Sequential and concurrent provider execution
- ✅ **Caching**: In-memory response caching with TTL
- ✅ **Metrics**: Success/failure rates and latency tracking
- ✅ **Configuration**: Dynamic configuration management
- ✅ **Error Handling**: Graceful failure with user-friendly messages
- ✅ **API Key Fallback**: Configurable fallback strategies for multiple API keys per provider
- ✅ **Local Model Support**: Automatic support for local models without API keys (Ollama, LM Studio, etc.)
- ✅ **Modern React**: Built with React 19, TypeScript, and Vite
- ✅ **Responsive UI**: Mobile-friendly design with modern styling

## Prerequisites

### For Ollama Support (Optional)
If you want to test with local Ollama models:

1. **Install Ollama**: Visit [ollama.ai](https://ollama.ai) and install Ollama
2. **Pull a model**: `ollama pull llama2`
3. **Start Ollama**: `ollama serve` (runs on localhost:11434)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Primary API keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
XAI_API_KEY=your_xai_api_key_here

# Optional backup API keys for fallback support
OPENAI_API_KEY_BACKUP=your_backup_openai_key_here
ANTHROPIC_API_KEY_BACKUP=your_backup_anthropic_key_here

# Multiple keys for different providers (for advanced fallback strategies)
GOOGLE_API_KEY_2=your_google_key_2
GOOGLE_API_KEY_3=your_google_key_3
GOOGLE_API_KEY_4=your_google_key_4
GOOGLE_API_KEY_5=your_google_key_5
XAI_API_KEY_2=your_xai_key_2
XAI_API_KEY_3=your_xai_key_3
XAI_API_KEY_4=your_xai_key_4
XAI_API_KEY_5=your_xai_key_5
XAI_API_KEY_6=your_xai_key_6
```

**Note**: The `.gitignore` file ensures your `.env` file (containing API keys) is never committed to version control.

### 3. Start the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Application Features

### AI Request Tab
Make AI inference requests using the configured providers.

- **Prompt Input**: Enter your prompt in the textarea
- **Mode Selection**: Choose between synchronous (sequential) or concurrent (parallel) execution
- **Response Display**: View the AI response with raw API data
- **Error Handling**: Graceful error messages when requests fail

### Metrics Tab
View performance metrics for all providers.

- **Real-time Metrics**: Success/failure counts and latency
- **Provider Breakdown**: Individual performance for each AI provider
- **Actions**: Reset metrics or clear response cache
- **Success Rates**: Calculated success percentages

### Configuration Tab
View the current application configuration.

- **Global Settings**: Orchestration mode, caching, logging preferences
- **Provider Details**: API URLs, models, and fallback strategies
- **Security**: API keys are not exposed in the UI

### Demo Tab
Test both synchronous and concurrent modes simultaneously.

- **Side-by-Side Comparison**: See results from both execution modes
- **Example Prompts**: Quick-access buttons for common test prompts
- **Metrics Integration**: View metrics impact after demo runs

### Health Tab
Check application health and system information.

- **Status Indicator**: Healthy/unhealthy status
- **System Info**: Framework versions and capabilities
- **Timestamp**: Last health check time

## Configuration

The application uses `polyinfer.config.ts` for configuration. Key settings:

- **providers**: Array of AI provider configurations
- **mode**: "synchronous" (try providers one by one) or "concurrent" (try all at once)
- **consecutive_success**: Switch providers after N consecutive successes
- **logging**: Enable console logging
- **metrics**: Track performance metrics
- **cache**: In-memory caching configuration

### Provider Configuration Options

Each provider supports:

- **name**: Unique identifier for the provider
- **api_url**: The HTTP endpoint for API requests
- **model**: Model name to use (substituted in request_structure)
- **request_structure**: JSON template for the request body
- **request_header**: Optional custom HTTP headers (e.g., `{'x-api-key': '{api_key}'}` or `{'authorization': 'Bearer {api_key}'}`)
- **api_key_from_env**: Array of environment variable names containing API keys
- **api_key_fallback_strategy**: How to handle multiple API keys for this provider
- **responsePath**: Path to extract text from the response

### Supported Providers

The example includes configurations for:

1. **OpenAI** - GPT-4o-mini model
2. **Anthropic** - Claude 3 Haiku model
3. **Google Gemini** - Gemini 2.0 Flash Experimental model
4. **Grok (xAI)** - Grok-2-1212 model (latest Grok model)
5. **Ollama** - Local Llama2 model (requires Ollama running on localhost:11434)
6. **Mock Provider** - For testing without API keys

### Adding New Providers

To add a new provider, update `polyinfer.config.ts`:

```typescript
{
  name: 'your-provider',
  api_url: 'https://api.your-provider.com/v1/chat',
  model: 'your-model',
  request_structure: JSON.stringify({
    model: '{model}',
    messages: [{ role: 'user', content: '{input}' }]
  }),
  request_header: {
    'authorization': 'Bearer {api_key}', // Or 'x-api-key': '{api_key}' for different auth methods
  },
  api_key_from_env: ['YOUR_PROVIDER_API_KEY'], // Can specify multiple keys: ['KEY1', 'KEY2']
  responsePath: 'choices[0].message.content'
}
```

## Understanding the Features

### Orchestration Modes

- **Synchronous**: Providers are tried sequentially until one succeeds
- **Concurrent**: All providers are called simultaneously, first response wins

### Caching

Responses are cached in memory for 5 minutes by default. Identical prompts return cached results instantly.

### Metrics

Track success rates, failure rates, and average latency for each provider.

### Error Handling

When all providers fail, returns user-friendly error messages instead of throwing exceptions.

### Per-Provider API Key Fallback

The application supports per-provider API key fallback strategies:

#### Available Strategies per Provider:

- **'first' (default)**: Only tries the first available API key
- **'all'**: Tries all available API keys until one succeeds
- **'count'**: Tries the first N keys (set via `api_key_fallback_count`)
- **'indices'**: Tries specific key indices (e.g., [0, 2, 4] for 1st, 3rd, 5th keys)
- **'range'**: Tries keys in a specific range (set start/end indices)
- **'subset'**: Tries a random subset from the first N keys

## Testing

The project includes a comprehensive test suite using Vitest:

### Running Tests

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

### Test Coverage

- Component rendering tests
- User interaction tests
- Hook functionality tests
- Error handling tests

## Development

### Project Structure

```
react-ts-example/
├── src/
│   ├── components/          # React components
│   │   ├── AIRequest.tsx    # AI request interface
│   │   ├── Metrics.tsx      # Metrics display
│   │   ├── Config.tsx       # Configuration viewer
│   │   ├── Demo.tsx         # Demo interface
│   │   └── Health.tsx       # Health check
│   ├── hooks/               # Custom React hooks
│   │   └── usePolyInfer.ts  # PolyInfer API hook
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # API response types
│   ├── test/                # Test utilities
│   │   └── setup.ts         # Test configuration
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   ├── App.test.tsx         # App component tests
│   └── main.tsx             # Application entry point
├── polyinfer.config.ts      # PolyInfer configuration
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
└── README.md
```

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI

## Troubleshooting

### Common Issues

1. **"No API key found"**: Ensure your `.env` file has the correct API keys, or configure providers with `api_key_from_env: []` for local models
2. **"Provider failed"**: Check your internet connection and API key validity
3. **Ollama connection failed**: Ensure Ollama is running (`ollama serve`) and model is pulled (`ollama pull llama2`)
4. **"No api key but required"**: Appears only after attempting without API key fails - indicates the provider needs authentication
5. **TypeScript errors**: Run `npm run build` to check for compilation errors

### Development Tips

- Use the browser's developer tools to inspect API calls and responses
- Check the console for logging output when `logging: true` in config
- The application automatically handles API errors and displays user-friendly messages
- All API calls are made through the `usePolyInfer` hook for consistency

## Security Note

⚠️ **Important**: This example demonstrates client-side API key usage for educational purposes. In production applications, API keys should never be exposed to the browser. Instead, implement a secure backend API that proxies requests to AI providers.

For production deployments, consider using the Node.js Express example as a backend service.

## Comparison with Node.js Example

This React example provides the same functionality as the Node.js Express example but with:

- **Interactive UI**: Web-based interface instead of REST API
- **Real-time Updates**: Live metrics and configuration viewing
- **Better UX**: User-friendly forms and error handling
- **Modern Stack**: React 19, TypeScript, Vite
- **Responsive Design**: Works on desktop and mobile devices

Both examples use the same underlying `genai-polyinfer` package and configuration, ensuring feature parity.

## License

This example application is provided as-is for demonstration purposes.
