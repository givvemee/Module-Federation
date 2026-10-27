import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { registerRemotesFromManifest } from './remote/manifest';

const root = createRoot(document.getElementById('root')!);

registerRemotesFromManifest()
  .catch((error) => console.error(error))
  .finally(() => {
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
  });
