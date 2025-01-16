import AboutView from '../elements/routes/pages/about/AboutView';
import AccessionView from '../elements/routes/pages/accession/AccessionView';
import ContentView from '../elements/routes/pages/content/ContentView';
import HomeView from '../elements/routes/pages/home/HomeView';
import NewsView from '../elements/routes/pages/news/NewsView';
import NotFoundView from '../elements/routes/pages/notfound/NotFoundView';
import SearchView from '../elements/routes/pages/search/SearchView';

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
  home: { path: base_url, label: 'Home', element: HomeView },
  search: { path: base_url + 'search', label: 'Search', element: SearchView },
  content: {
    path: base_url + 'content',
    label: 'Content',
    element: ContentView,
  },
  accession: {
    path: base_url + 'recordDisplay',
    label: 'Accession',
    element: AccessionView,
  },
  accessionMassBank2: {
    path: base_url + 'RecordDisplay',
    label: 'Accession',
    element: AccessionView,
  },
  news: { path: base_url + 'news', label: 'News', element: NewsView },
  about: { path: base_url + 'about', label: 'About', element: AboutView },
  notFound: { path: base_url + '*', label: 'Not Found', element: NotFoundView },
};

export default routes;
