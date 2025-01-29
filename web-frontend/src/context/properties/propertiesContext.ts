import { createContext, useContext } from 'react';

interface PropertiesContextProps {
  baseUrl: string;
  backendUrl: string;
  frontendUrl: string;
  exportServiceUrl: string;
  version: string;
}

const emptyState: PropertiesContextProps = {
  baseUrl: '',
  backendUrl: '',
  frontendUrl: '',
  exportServiceUrl: '',
  version: '',
};
const PropertiesContext = createContext<PropertiesContextProps>(emptyState);

function usePropertiesContext() {
  return useContext(PropertiesContext);
}

export { usePropertiesContext, PropertiesContext };
export type { PropertiesContextProps };
