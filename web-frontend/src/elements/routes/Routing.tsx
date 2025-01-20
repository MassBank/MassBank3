import { Routes, Route } from 'react-router-dom';
import routes from '../../constants/routes';
import UserInterface from './UserInterface';
import Sitemap from './pages/sitemap/Sitemap';

const baseUrl = import.meta.env.VITE_MB3_BASE_URL;

function Routing() {
  return (
    <Routes>
      {Object.values(routes)
        .map((route) => (
          <Route
            key={'routing-key-' + route.id}
            path={route.path}
            element={
              route.type === 'file' ? (
                <route.component />
              ) : (
                <UserInterface body={<route.component />} />
              )
            }
          />
        ))
        .concat(
          <Route
            key={'routing-key-sitemap-xml-file'}
            path={baseUrl + 'sitemap/:index'}
            element={<Sitemap />}
          />,
        )}
    </Routes>
  );
}

export default Routing;
