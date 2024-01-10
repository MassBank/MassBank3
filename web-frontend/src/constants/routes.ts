import About from '../elements/routes/pages/about/About';
import Accession from '../elements/routes/pages/accession/Accession';
import Content from '../elements/routes/pages/content/Content';
import Documentation from '../elements/routes/pages/documentation/Documentation';
import Download from '../elements/routes/pages/download/Download';
import Home from '../elements/routes/pages/home/Home';
import News from '../elements/routes/pages/news/News';
import NotFound from '../elements/routes/pages/notfound/NotFound';
import Search from '../elements/routes/pages/search/Search';

interface ifc1 {
  path: string;
  label: string;
  // eslint-disable-next-line no-unused-vars
  element: (props) => JSX.Element;
}

interface ifc2 {
  [key: string]: ifc1;
}

const routes: ifc2 = {
  home: { path: '/', label: 'Home', element: Home },
  search: { path: '/search', label: 'Search', element: Search },
  content: { path: '/content', label: 'Content', element: Content },
  download: { path: '/download', label: 'Download', element: Download },
  accession: { path: '/recordDisplay', label: 'Accession', element: Accession },
  // accessionExternal: {
  //   path: '/MassBank/RecordDisplay',
  //   label: 'Accession',
  //   element: Accession,
  // },
  documentation: {
    path: '/documentation',
    label: 'Documentation',
    element: Documentation,
  },
  about: { path: '/about', label: 'About', element: About },
  news: { path: '/news', label: 'News', element: News },
  notFound: { path: '*', label: 'Not Found', element: NotFound },
};

export default routes;
