import { Routes, Route } from 'react-router-dom';
import routes from '../../constants/routes';
import UserInterface from './UserInterface';
import { usePropertiesContext } from '../../context/properties/properties';

function Routing() {
  const { baseUrl } = usePropertiesContext();
  return (
    <Routes>
      {Object.values(routes).map((route) => {
        return (
          <Route
            key={'routing-key-' + route.id}
            path={baseUrl + '/' + route.path}
            element={<UserInterface body={<route.component />} />}
          />
        );
      })}
    </Routes>
  );
}

export default Routing;
