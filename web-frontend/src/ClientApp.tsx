import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Routing from './elements/routes/Routing';
import { propertiesContext } from './context/properties/properties';
import PropertiesContextProps from './types/PropertiesContextProps';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const props = (window as any).__INITIAL_DATA__ as PropertiesContextProps;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (window as any).__INITIAL_DATA__;

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <propertiesContext.Provider value={props}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </propertiesContext.Provider>
  </StrictMode>,
);
