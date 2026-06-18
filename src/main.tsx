import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Active Cache Invalidation: Unregister outdated Service Workers that freeze index.html
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log("Deleted old frozen service worker cache block.");
        }
      });
    }
  }).catch((err) => {
    console.error("Error clearing service worker registries:", err);
  });
}

// Auto-Recovery on Deployments: Forces a transparent reload if the browser fails to import a compiled script
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const message = event.message || "";
    if (
      message.indexOf("ChunkLoadError") !== -1 ||
      message.indexOf("Loading chunk") !== -1 ||
      message.indexOf("Failed to fetch dynamically imported module") !== -1
    ) {
      console.warn("Outdated asset detected (likely due to a new build deployment). Reloading page...");
      window.location.reload();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

