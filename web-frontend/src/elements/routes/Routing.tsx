import { Routes, Route } from 'react-router-dom';
import routes from '../../constants/routes';
import UserInterface from './UserInterface';
import { usePropertiesContext } from '../../context/properties/properties';
import { useMemo } from 'react';

function Routing() {
  const { baseUrl } = usePropertiesContext();

  return useMemo(
    () => (
      <Routes>
        {Object.values(routes).map((route) => (
          <Route
            key={'routing-key-' + route.id}
            path={baseUrl + '/' + route.path}
            element={<UserInterface body={<route.component />} />}
          />
        ))}
      </Routes>
    ),
    [baseUrl],
  );
}

export default Routing;
