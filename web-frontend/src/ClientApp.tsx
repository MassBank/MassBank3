import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { propertiesContext } from './context/properties/properties';
import PropertiesContextProps from './types/PropertiesContextProps';
import App from './App';

const initialDataElement = document.getElementById('initial-data');
if (!initialDataElement?.textContent) {
  throw new Error('Missing initial frontend data.');
}
const props = JSON.parse(
  initialDataElement.textContent,
) as PropertiesContextProps;

const nonce = document.querySelector<HTMLMetaElement>(
  'meta[name="csp-nonce"]',
)?.content;
if (!nonce) {
  throw new Error('Missing CSP nonce.');
}

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <propertiesContext.Provider value={props}>
      <BrowserRouter>
        <App nonce={nonce} />
      </BrowserRouter>
    </propertiesContext.Provider>
  </StrictMode>,
);
