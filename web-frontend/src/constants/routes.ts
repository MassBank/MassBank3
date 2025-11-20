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

const routes = {
  home: {
    component: HomeView,
    label: 'Home',
    id: 'home',
    path: '/',
  } as RouteType,
  search: {
    component: SearchView,
    label: 'Search',
    id: 'search',
    path: 'search',
  } as RouteType,
  content: {
    component: ContentView,
    label: 'Content',
    id: 'content',
    path: 'content',
  } as RouteType,
  service: {
    component: ServiceView,
    label: 'Service',
    id: 'service',
    path: 'service',
  } as RouteType,
  documentation: {
    component: DocumentationView,
    label: 'Documentation',
    id: 'documentation',
    path: 'documentation',
  } as RouteType,
  news: {
    component: NewsView,
    label: 'News',
    id: 'news',
    path: 'news',
  } as RouteType,
  about: {
    component: AboutView,
    label: 'About',
    id: 'about',
    path: 'about',
  } as RouteType,
  accessionNext: {
    component: AccessionView,
    label: 'Accession',
    id: 'accession',
    path: 'recordDisplay',
  } as RouteType,
  accession: {
    component: AccessionView,
    label: 'Accession',
    id: 'accessionPrevious',
    path: 'RecordDisplay',
  } as RouteType,
  notFound: {
    component: NotFoundView,
    label: 'Not Found',
    id: 'notFound',
    path: '*',
  } as RouteType,
};

export default routes;
