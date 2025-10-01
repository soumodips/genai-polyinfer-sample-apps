# GenAI-PolyInfer Node Express Example

A comprehensive example Node.js server demonstrating all features of the `genai-polyinfer` package. This server showcases provider orchestration, caching, metrics tracking, and different execution modes.

## Features Demonstrated

- ✅ **Multi-Provider Orchestration**: Sequential and concurrent provider execution
- ✅ **Caching**: In-memory response caching with TTL
- ✅ **Metrics**: Success/failure rates and latency tracking
- ✅ **Logging**: Request logging and error handling
- ✅ **Configuration**: Dynamic configuration management
- ✅ **Error Handling**: Graceful failure with quirky messages
- ✅ **API Key Fallback**: Configurable fallback strategies for multiple API keys per provider
- ✅ **Local Model Support**: Automatic support for local models without API keys (Ollama, LM Studio, etc.)

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

PORT=3000
```

**Note**: The `.gitignore` file ensures your `.env` file (containing API keys) is never committed to version control.

### 3. Build and Run

```bash
# Build the TypeScript code
npm run build

# Start the server
npm start

# Or run in development mode with auto-reload
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST /say
Make an AI inference request using the configured providers.

**Request:**
```json
{
  "prompt": "Explain quantum computing in simple terms",
  "mode": "synchronous"  // optional: "synchronous" or "concurrent"
}
```

**Response:**
```json
{
  "success": true,
  "prompt": "Explain quantum computing in simple terms",
  "response": "Quantum computing uses quantum bits...",
  "raw_response": { ... },
  "mode": "synchronous"
}
```

### GET /metrics
Get current performance metrics for all providers.

**Response:**
```json
{
  "success": true,
  "metrics": {
    "openai": {
      "success": 5,
      "failure": 0,
      "latency": 1250,
      "count": 5
    },
    "anthropic": {
      "success": 3,
      "failure": 1,
      "latency": 980,
      "count": 4
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /reset-metrics
Reset all metrics counters.

**Response:**
```json
{
  "success": true,
  "message": "Metrics reset successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /clear-cache
Clear the in-memory response cache.

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /config
Get the current configuration (API keys are not exposed).

**Response:**
```json
{
  "success": true,
  "config": {
    "providers": [
      {
        "name": "openai",
        "model": "gpt-4o-mini",
        "api_url": "https://api.openai.com/v1/chat/completions",
        "api_key_from_env": ["OPENAI_API_KEY"],
        "responsePath": "choices[0].message.content"
      }
    ],
    "mode": "synchronous",
    "logging": true,
    "metrics": true,
    "cache": { "enabled": true, "ttl": 300000 }
  }
}
```

### POST /demo
Test both synchronous and concurrent modes with the same prompt.

**Request:**
```json
{
  "prompt": "What is the capital of France?"
}
```

**Response:**
```json
{
  "success": true,
  "prompt": "What is the capital of France?",
  "results": {
    "synchronous": {
      "response": "Paris",
      "raw_response": { ... }
    },
    "concurrent": {
      "response": "Paris",
      "raw_response": { ... }
    }
  },
  "metrics": { ... }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

## Configuration

The server uses `polyinfer.config.ts` for configuration. Key settings:

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

**Multiple API Keys**: You can specify multiple environment variables for API keys to enable automatic fallback. If one key fails, the next available key will be tried based on your configured `api_key_fallback_strategy`.

## Testing the Server

### Using curl

```bash
# Make a simple request
curl -X POST http://localhost:3000/say \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'

# Check metrics
curl http://localhost:3000/metrics

# Reset metrics
curl -X POST http://localhost:3000/reset-metrics

# Clear cache
curl -X POST http://localhost:3000/clear-cache
```

### Using JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:3000/say', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Tell me a joke' })
});

const result = await response.json();
console.log(result.response);
```

## Testing

The project includes a comprehensive test script (`test-api.js`) that tests all API endpoints:

### Automated Testing

```bash
# Start the server in one terminal
npm run dev

# Run tests in another terminal
npm test
```

The test script will:
- ✅ Test all API endpoints
- ✅ Verify error handling
- ✅ Check metrics tracking
- ✅ Validate configuration loading
- ✅ Test graceful failure handling

### Manual Testing

```bash
# Health check
curl http://localhost:3000/health

# Make AI request
curl -X POST http://localhost:3000/say \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, world!"}'

# View metrics
curl http://localhost:3000/metrics

# Test demo endpoint
curl -X POST http://localhost:3000/demo \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is AI?"}'
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

When all providers fail, returns a quirky error message instead of throwing exceptions.

### Per-Provider API Key Fallback

The server now supports per-provider API key fallback strategies, giving you fine-grained control over how each provider handles multiple API keys:

#### Available Strategies per Provider:

- **'first' (default)**: Only tries the first available API key
- **'all'**: Tries all available API keys until one succeeds
- **'count'**: Tries the first N keys (set via `api_key_fallback_count`)
- **'indices'**: Tries specific key indices (e.g., [0, 2, 4] for 1st, 3rd, 5th keys)
- **'range'**: Tries keys in a specific range (e.g., keys 3-5)
- **'subset'**: Tries a random subset from the first N keys

#### Example Configurations:

```typescript
// OpenAI: Only try first key (simple, reliable)
{
  name: 'openai',
  api_key_from_env: ['OPENAI_API_KEY', 'OPENAI_API_KEY_BACKUP'],
  api_key_fallback_strategy: 'first',
}

// Anthropic: Try first 2 keys
{
  name: 'anthropic',
  api_key_from_env: ['ANTHROPIC_API_KEY', 'ANTHROPIC_API_KEY_BACKUP'],
  api_key_fallback_strategy: 'count',
  api_key_fallback_count: 2,
}

// Gemini: Try specific keys (1st, 3rd, 5th)
{
  name: 'gemini',
  api_key_from_env: ['GOOGLE_API_KEY_1', 'GOOGLE_API_KEY_2', 'GOOGLE_API_KEY_3', 'GOOGLE_API_KEY_4', 'GOOGLE_API_KEY_5'],
  api_key_fallback_strategy: 'indices',
  api_key_fallback_indices: [0, 2, 4],
}

// Grok: Try keys 3-5 (indices 2, 3, 4)
{
  name: 'grok',
  api_key_from_env: ['XAI_API_KEY_1', 'XAI_API_KEY_2', 'XAI_API_KEY_3', 'XAI_API_KEY_4', 'XAI_API_KEY_5', 'XAI_API_KEY_6'],
  api_key_fallback_strategy: 'range',
  api_key_fallback_range_start: 2,
  api_key_fallback_range_end: 4,
}
```

This feature provides resilience against API key failures, rate limits, or temporary service issues. Configure multiple keys in your `.env` file:

```env
# Multiple keys for different providers
OPENAI_API_KEY=your_openai_key_1
OPENAI_API_KEY_BACKUP=your_openai_key_2
ANTHROPIC_API_KEY=your_anthropic_key_1
ANTHROPIC_API_KEY_BACKUP=your_anthropic_key_2
GOOGLE_API_KEY_1=your_google_key_1
GOOGLE_API_KEY_2=your_google_key_2
GOOGLE_API_KEY_3=your_google_key_3
GOOGLE_API_KEY_4=your_google_key_4
GOOGLE_API_KEY_5=your_google_key_5
```

### Local Model Support

The server automatically supports local model servers that don't require API keys:

- **Automatic Detection**: When a provider has no API keys configured (`api_key_from_env: []`), the server first attempts requests without authentication
- **Graceful Fallback**: Only if the no-API-key attempt fails does it log "No api key but required"
- **Perfect for Local Models**: Works seamlessly with Ollama, LM Studio, text-generation-webui, and other local inference servers

#### Example Local Model Configuration

```typescript
{
  name: 'ollama-llama2',
  api_url: 'http://localhost:11434/api/generate',
  model: 'llama2',
  request_structure: JSON.stringify({
    model: '{model}',
    prompt: '{input}',
    stream: false
  }),
  api_key_from_env: [], // Empty array enables local model support
  responsePath: 'response'
}
```

This enables you to run AI models locally without any API keys while maintaining the same orchestration, caching, and metrics features as cloud providers.

## Development

### Project Structure

```
node-express-example/
├── src/
│   └── index.ts          # Main server file
├── polyinfer.config.ts   # Configuration
├── test-api.js           # API test script
├── .gitignore            # Git ignore rules
├── package.json
├── tsconfig.json
├── .env.example          # Environment template
└── README.md
```

### Scripts

- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm run dev` - Run with auto-reload during development
- `npm test` - Run API tests (requires server to be running)
- `npm run test:manual` - Show manual testing instructions

## Troubleshooting

### Common Issues

1. **"No API key found"**: Ensure your `.env` file has the correct API keys, or configure providers with `api_key_from_env: []` for local models
2. **"Provider failed"**: Check your internet connection and API key validity
3. **Ollama connection failed**: Ensure Ollama is running (`ollama serve`) and model is pulled (`ollama pull llama2`)
4. **"No api key but required"**: Appears only after attempting without API key fails - indicates the provider needs authentication
5. **TypeScript errors**: Run `npm run build` to compile the code

### Logs

The server logs all requests and provider attempts to the console. Enable verbose logging by setting `logging: true` in the config.

## License

This example server is provided as-is for demonstration purposes.