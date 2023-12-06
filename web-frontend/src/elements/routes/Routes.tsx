import { useRoutes } from 'react-router-dom';

import routes from '../../constants/routes';

function Routes() {
  const paths = Object.keys(routes).map((r) => {
    const route = routes[r];
    return { path: route.path, element: route.element };
  });

  return useRoutes(paths);
}

export default Routes;
