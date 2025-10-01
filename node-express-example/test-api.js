// Simple API test script for node-express-example
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(method, path, data = null, description) {
  try {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    console.log(`\n🧪 Testing: ${description}`);
    console.log(`${method} ${url}`);

    const response = await fetch(url, options);
    const result = await response.json();

    if (response.ok) {
      console.log(`✅ ${response.status}: ${description}`);
      return result;
    } else {
      console.log(`❌ ${response.status}: ${description}`);
      console.log('Error:', result);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error testing ${description}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API tests for node-express-example');
  console.log('=' .repeat(50));

  // Test 1: Health check
  await testEndpoint('GET', '/health', null, 'Health check endpoint');

  // Test 2: Get configuration
  const config = await testEndpoint('GET', '/config', null, 'Get configuration');
  if (config) {
    console.log(`   📊 Found ${config.config.providers.length} providers`);
  }

  // Test 3: Get initial metrics
  await testEndpoint('GET', '/metrics', null, 'Get initial metrics');

  // Test 4: Make AI request (should fail gracefully)
  await testEndpoint('POST', '/say', { prompt: 'Hello, test!' }, 'AI request (should fail gracefully)');

  // Test 5: Check metrics after request
  const metrics = await testEndpoint('GET', '/metrics', null, 'Get metrics after request');
  if (metrics && Object.keys(metrics.metrics).length > 0) {
    console.log(`   📈 Recorded failures for ${Object.keys(metrics.metrics).length} providers`);
  }

  // Test 6: Reset metrics
  await testEndpoint('POST', '/reset-metrics', null, 'Reset metrics');

  // Test 7: Verify metrics reset
  await testEndpoint('GET', '/metrics', null, 'Verify metrics reset');

  // Test 8: Clear cache
  await testEndpoint('POST', '/clear-cache', null, 'Clear cache');

  // Test 9: Test demo endpoint
  await testEndpoint('POST', '/demo', { prompt: 'Test demo' }, 'Demo endpoint (both modes)');

  // Test 10: Test 404
  await testEndpoint('GET', '/nonexistent', null, '404 error handling');

  console.log('\n' + '=' .repeat(50));
  console.log('✨ API tests completed!');
  console.log('\n💡 To run with real API keys:');
  console.log('   1. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY in .env');
  console.log('   2. Restart the server');
  console.log('   3. Run tests again to see successful AI responses');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { testEndpoint, runTests };