import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './providers.jsx';
import { TopBar } from '../features/shared/components/TopBar.jsx';
import { AppRouter } from './router.jsx';
import '../styles/globals.css';
import '../styles/tokens.css';

export function App() {
  return (
    <AppProviders>
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1">
          <AppRouter />
        </div>
      </div>
    </AppProviders>
  );
}

// Mount in browser environment
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export default App;
