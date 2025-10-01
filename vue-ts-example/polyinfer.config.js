const config = {
  all_intents: ['chat', 'code', 'summary', 'creative', 'analysis'],
  providers: [
    {
      name: 'openai',
      api_url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini',
      request_structure: JSON.stringify({
        model: '{model}',
        messages: [{ role: 'user', content: '{input}' }],
      }),
      request_header: {
        'authorization': 'Bearer {api_key}',
      },
      api_key_from_env: ['VITE_OPENAI_API_KEY', 'VITE_OPENAI_API_KEY_BACKUP'],
      api_key_fallback_strategy: 'first',
      api_key_fallback_count: 2,
      intent: ['chat', 'code', 'summary'],
      responsePath: 'choices[0].message.content',
    },
    {
      name: 'anthropic',
      api_url: 'https://api.anthropic.com/v1/messages',
      model: 'claude-3-haiku-20240307',
      request_structure: JSON.stringify({
        model: '{model}',
        max_tokens: 1024,
        messages: [{ role: 'user', content: '{input}' }],
      }),
      request_header: {
        'x-api-key': '{api_key}',
      },
      api_key_from_env: ['VITE_ANTHROPIC_API_KEY', 'VITE_ANTHROPIC_API_KEY_BACKUP'],
      api_key_fallback_strategy: 'count',
      api_key_fallback_count: 2,
      intent: ['chat', 'analysis'],
      responsePath: 'content[0].text',
    },
    {
      name: 'gemini',
      api_url:
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      model: 'gemini-2.5-flash',
      request_structure: JSON.stringify({
        generationConfig: {},
        safetySettings: [],
        contents: [
          {
            role: 'user',
            parts: [{ text: '{input}' }],
          },
        ],
      }),
      request_header: {
        'x-goog-api-key': '{api_key}',
      },
      api_key_from_env: ['VITE_GOOGLE_API_KEY'],
      api_key_fallback_strategy: 'first',
      api_key_fallback_count: 1,
      api_key_fallback_indices: [0],
      intent: ['chat', 'creative'],
      responsePath: 'candidates[0].content.parts[0].text',
    },
    {
      name: 'grok',
      api_url: 'https://api.x.ai/v1/chat/completions',
      model: 'grok-2-1212',
      request_structure: JSON.stringify({
        model: '{model}',
        messages: [{ role: 'user', content: '{input}' }],
        stream: false,
        temperature: 0.7,
      }),
      request_header: {
        'authorization': 'Bearer {api_key}',
      },
      api_key_from_env: [
        'VITE_XAI_API_KEY',
        'VITE_XAI_API_KEY_2',
        'VITE_XAI_API_KEY_3',
        'VITE_XAI_API_KEY_4',
        'VITE_XAI_API_KEY_5',
        'VITE_XAI_API_KEY_6',
      ],
      api_key_fallback_strategy: 'range',
      api_key_fallback_count: 2,
      api_key_fallback_range_start: 2,
      api_key_fallback_range_end: 4,
      intent: ['chat', 'code'],
      responsePath: 'choices[0].message.content',
    },
    {
      name: 'ollama',
      api_url: 'http://localhost:11434/api/generate',
      model: 'llama2',
      request_structure: JSON.stringify({
        model: '{model}',
        prompt: '{input}',
        stream: false,
      }),
      api_key_from_env: [], // No API key needed for local Ollama
      api_key_fallback_strategy: 'first',
      api_key_fallback_count: 2,
      intent: 'chat',
      responsePath: 'response',
    },
    {
      name: 'mock-provider',
      api_url: 'https://httpbin.org/post',
      model: 'mock-model',
      request_structure: JSON.stringify({
        prompt: '{input}',
        model: '{model}',
      }),
      api_key_from_env: [], // No API key needed for mock
      api_key_fallback_strategy: 'first',
      api_key_fallback_count: 2,
      intent: 'chat',
      responsePath: 'json.response', // Mock response path
    },
  ],

  // ============================================================================
  // PER-PROVIDER API KEY FALLBACK STRATEGIES
  // ============================================================================
  //
  // Each provider can now have its own API key fallback strategy instead of
  // using a global strategy. This gives you fine-grained control over how
  // each provider handles multiple API keys.
  //
  // Available strategies:
  //
  // 1. 'first' (default) - Only try the first available API key
  //    Example: OpenAI provider uses this for simplicity
  //
  // 2. 'all' - Try all available API keys until one succeeds
  //    Example: Uncomment and use for maximum reliability
  //
  // 3. 'count' - Try the first N keys (set via api_key_fallback_count)
  //    Example: Anthropic provider tries first 2 keys
  //
  // 4. 'indices' - Try specific key indices (set via api_key_fallback_indices)
  //    Example: Gemini provider tries keys at positions 0, 2, 4 (1st, 3rd, 5th)
  //    api_key_fallback_indices: [0, 2, 4]
  //
  // 5. 'range' - Try keys in a specific range (set start/end indices)
  //    Example: Grok provider tries keys 3-5 (indices 2, 3, 4)
  //    api_key_fallback_range_start: 2,
  //    api_key_fallback_range_end: 4,
  //
  // 6. 'subset' - Try a random subset from the first N keys
  //    Example: Try 3 random keys from the first 5 available
  //    api_key_fallback_strategy: 'subset',
  //    api_key_fallback_subset_count: 3,
  //    api_key_fallback_subset_from: 5,
  //
  // To add multiple keys to your .env file:
  // VITE_OPENAI_API_KEY=your_key_1
  // VITE_OPENAI_API_KEY_BACKUP=your_key_2
  // VITE_ANTHROPIC_API_KEY=your_key_1
  // VITE_ANTHROPIC_API_KEY_BACKUP=your_key_2
  // VITE_GOOGLE_API_KEY=your_key_1
  // VITE_GOOGLE_API_KEY_2=your_key_2
  // VITE_GOOGLE_API_KEY_3=your_key_3
  // VITE_GOOGLE_API_KEY_4=your_key_4
  // VITE_GOOGLE_API_KEY_5=your_key_5
  // VITE_XAI_API_KEY=your_key_1
  // VITE_XAI_API_KEY_2=your_key_2
  // VITE_XAI_API_KEY_3=your_key_3
  // VITE_XAI_API_KEY_4=your_key_4
  // VITE_XAI_API_KEY_5=your_key_5
  // VITE_XAI_API_KEY_6=your_key_6
  // ============================================================================

  mode: 'synchronous', // Try providers sequentially to use first successful provider, concurrent to use fastest provider
  consecutive_success: 3, // Switch after 3 consecutive successes
  logging: true,
  metrics: true,
  cache: { enabled: true, ttl: 300000 }, // 5 minutes cache
};
export default config;
