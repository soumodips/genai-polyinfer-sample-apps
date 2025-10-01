import { useState } from 'react';
import './App.css';
import { AIRequest } from './components/AIRequest.tsx';
import { Metrics } from './components/Metrics.tsx';
import { Config } from './components/Config.tsx';
import { Demo } from './components/Demo.tsx';
import { Health } from './components/Health.tsx';

type Tab = 'ai' | 'metrics' | 'config' | 'demo' | 'health';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('ai');

  const tabs = [
    { id: 'ai' as Tab, label: 'AI Request', component: AIRequest },
    { id: 'metrics' as Tab, label: 'Metrics', component: Metrics },
    { id: 'config' as Tab, label: 'Configuration', component: Config },
    { id: 'demo' as Tab, label: 'Demo', component: Demo },
    { id: 'health' as Tab, label: 'Health', component: Health },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || AIRequest;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 GenAI-PolyInfer React Example</h1>
        <p>Demonstrating all features of the genai-polyinfer package</p>
      </header>

      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="tab-content">
        <ActiveComponent />
      </main>

      <footer className="app-footer">
        <p>
          Built with React + TypeScript + Vite |
          Powered by <a href="https://github.com/soumik12345/genai-polyinfer" target="_blank" rel="noopener noreferrer">genai-polyinfer</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
