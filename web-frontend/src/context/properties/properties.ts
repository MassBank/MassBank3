import { createContext, useContext } from 'react';
import PropertiesContextProps from '../../types/PropertiesContextProps';

const emptyState: PropertiesContextProps = {
  baseUrl: '',
  backendUrl: '',
  frontendUrl: '',
  exportServiceUrl: '',
  version: '',
  distributorText: '',
  distributorUrl: '',
};

const propertiesContext = createContext<PropertiesContextProps>(emptyState);

function usePropertiesContext() {
  return useContext(propertiesContext);
}

export { usePropertiesContext, propertiesContext };
