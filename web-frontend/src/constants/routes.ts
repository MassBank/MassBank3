import About from '../elements/routes/pages/about/About';
import Accession from '../elements/routes/pages/accession/Accession';
import Content from '../elements/routes/pages/content/Content';
import Documentation from '../elements/routes/pages/documentation/Documentation';
import Download from '../elements/routes/pages/download/Download';
import Home from '../elements/routes/pages/home/Home';
import News from '../elements/routes/pages/news/News';
import NotFound from '../elements/routes/pages/notfound/NotFound';
import Search from '../elements/routes/pages/search/Search';

const base_url = import.meta.env.VITE_MB3_BASE_URL;

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
  home: { path: base_url, label: 'Home', element: Home },
  search: { path: base_url + 'search', label: 'Search', element: Search },
  content: { path: base_url + 'content', label: 'Content', element: Content },
  download: {
    path: base_url + 'download',
    label: 'Download',
    element: Download,
  },
  accession: {
    path: base_url + 'recordDisplay',
    label: 'Accession',
    element: Accession,
  },
  documentation: {
    path: base_url + 'documentation',
    label: 'Documentation',
    element: Documentation,
  },
  about: { path: base_url + 'about', label: 'About', element: About },
  news: { path: base_url + 'news', label: 'News', element: News },
  notFound: { path: base_url + '*', label: 'Not Found', element: NotFound },
};

export default routes;
