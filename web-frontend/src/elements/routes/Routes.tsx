import { Routes, Route } from 'react-router-dom';
import routes from '../../constants/routes';

function Routing() {
  return (
    <Routes>
      <Route path={routes.home.path} element={<routes.home.element />} />
      <Route path={routes.search.path} element={<routes.search.element />} />
      <Route path={routes.content.path} element={<routes.content.element />} />
      <Route
        path={routes.download.path}
        element={<routes.download.element />}
      />
      <Route
        path={routes.accession.path}
        element={<routes.accession.element />}
      />
      {/* <Route
        path={routes.accessionExternal.path}
        element={<Redirect to={routes.accession.path} />}
      /> */}
      <Route
        path={routes.documentation.path}
        element={<routes.documentation.element />}
      />
      <Route path={routes.about.path} element={<routes.about.element />} />
      <Route path={routes.news.path} element={<routes.news.element />} />
      <Route
        path={routes.notFound.path}
        element={<routes.notFound.element />}
      />
    </Routes>
  );
}

export default Routing;
