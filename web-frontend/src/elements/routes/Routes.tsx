import { Routes, Route, RouteObject } from 'react-router-dom';
import routes from '../../constants/routes';

function Routing() {
  const homeRoute = routes.find((r) => r.id === 'Home') as RouteObject;
  const searchRoute = routes.find((r) => r.id === 'Search') as RouteObject;
  const contentRoute = routes.find((r) => r.id === 'Content') as RouteObject;
  const accessionRoute = routes.find(
    (r) => r.id === 'Accession',
  ) as RouteObject;
  const newsRoute = routes.find((r) => r.id === 'News') as RouteObject;
  const aboutRoute = routes.find((r) => r.id === 'About') as RouteObject;
  const notFoundRoute = routes.find((r) => r.id === 'NotFound') as RouteObject;

  return (
    <Routes>
      <Route
        path={homeRoute.path as string}
        element={homeRoute.Component ? <homeRoute.Component /> : null}
      />
      <Route
        path={searchRoute.path as string}
        element={searchRoute.Component ? <searchRoute.Component /> : null}
      />
      <Route
        path={contentRoute.path as string}
        element={contentRoute.Component ? <contentRoute.Component /> : null}
      />
      <Route
        path={accessionRoute.path as string}
        element={accessionRoute.Component ? <accessionRoute.Component /> : null}
      />
      <Route
        path={newsRoute.path as string}
        element={newsRoute.Component ? <newsRoute.Component /> : null}
      />
      <Route
        path={aboutRoute.path}
        element={aboutRoute.Component ? <aboutRoute.Component /> : null}
      />
      <Route
        path={notFoundRoute.path}
        element={notFoundRoute.Component ? <notFoundRoute.Component /> : null}
      />
    </Routes>
  );
}

export default Routing;
