import { RouteObject } from 'react-router-dom';
import AboutView from '../elements/routes/pages/about/AboutView';
import AccessionView from '../elements/routes/pages/accession/AccessionView';
import ContentView from '../elements/routes/pages/content/ContentView';
import HomeView from '../elements/routes/pages/home/HomeView';
import NewsView from '../elements/routes/pages/news/NewsView';
import NotFoundView from '../elements/routes/pages/notfound/NotFoundView';
import SearchView from '../elements/routes/pages/search/SearchView';

const base_url = import.meta.env.VITE_MB3_BASE_URL;

const routes: RouteObject[] = [
  {
    Component: HomeView,
    id: 'Home',
    path: base_url,
  },
  {
    Component: SearchView,
    id: 'Search',
    path: base_url + 'search',
  },
  {
    Component: ContentView,
    id: 'Content',
    path: base_url + 'content',
  },
  {
    Component: AccessionView,
    id: 'Accession',
    path: base_url + 'recordDisplay',
  },
  {
    Component: AccessionView,
    id: 'AccessionMassBank2',
    path: base_url + 'RecordDisplay',
  },
  {
    Component: NewsView,
    id: 'News',
    path: base_url + 'news',
  },
  {
    Component: AboutView,
    id: 'About',
    path: base_url + 'about',
  },
  {
    Component: NotFoundView,
    id: 'NotFound',
    path: base_url + '*',
  },
];

export default routes;
