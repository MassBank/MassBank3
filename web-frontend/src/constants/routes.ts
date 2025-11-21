import RouteType from '../types/RouteType';
import AboutView from '../elements/routes/pages/about/AboutView';
import AccessionView from '../elements/routes/pages/accession/AccessionView';
import ContentView from '../elements/routes/pages/content/ContentView';
import HomeView from '../elements/routes/pages/home/HomeView';
import NotFoundView from '../elements/routes/pages/notfound/NotFoundView';
import SearchView from '../elements/routes/pages/search/SearchView';
import ServiceView from '../elements/routes/pages/service/ServiceView';
import NewsView from '../elements/routes/pages/more/NewsView';
import DocumentationView from '../elements/routes/pages/more/DocumentationView';

const routes: Record<string, RouteType> = {
  home: {
    component: HomeView,
    label: 'Home',
    id: 'home',
    path: '/',
  },
  search: {
    component: SearchView,
    label: 'Search',
    id: 'search',
    path: 'search',
  },
  content: {
    component: ContentView,
    label: 'Content',
    id: 'content',
    path: 'content',
  },
  service: {
    component: ServiceView,
    label: 'Service',
    id: 'service',
    path: 'service',
  },
  documentation: {
    component: DocumentationView,
    label: 'Documentation',
    id: 'documentation',
    path: 'documentation',
  },
  news: {
    component: NewsView,
    label: 'News',
    id: 'news',
    path: 'news',
  },
  about: {
    component: AboutView,
    label: 'About',
    id: 'about',
    path: 'about',
  },
  accessionNext: {
    component: AccessionView,
    label: 'Accession',
    id: 'accession',
    path: 'recordDisplay',
  },
  accession: {
    component: AccessionView,
    label: 'Accession',
    id: 'accessionPrevious',
    path: 'RecordDisplay',
  },
  notFound: {
    component: NotFoundView,
    label: 'Not Found',
    id: 'notFound',
    path: '*',
  },
};

export default routes;
