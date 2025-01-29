import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Routing from './elements/routes/Routing';
import '@ant-design/v5-patch-for-react-19';
import { PropertiesContext } from './context/properties/propertiesContext';

const backendUrl = 'http://localhost:8081';
const frontendUrl = 'http://localhost:8080';
const baseUrl = '/MassBank3/';
const exportServiceUrl = 'http://localhost:8083';
const version = process.env.REACT_APP_MB3_VERSION as string;

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <PropertiesContext.Provider
        value={{
          baseUrl,
          backendUrl,
          frontendUrl,
          exportServiceUrl,
          version,
        }}
      >
        <Routing />
      </PropertiesContext.Provider>
    </BrowserRouter>
  </StrictMode>,
);
