import React from 'react';
import AboutView from '../elements/routes/pages/about/AboutView';
import AccessionView from '../elements/routes/pages/accession/AccessionView';
import ContentView from '../elements/routes/pages/content/ContentView';
import HomeView from '../elements/routes/pages/home/HomeView';
import NewsView from '../elements/routes/pages/news/NewsView';
import NotFoundView from '../elements/routes/pages/notfound/NotFoundView';
import SearchView from '../elements/routes/pages/search/SearchView';
import Documentation from '../elements/routes/pages/documentation/Documentation';

type RouteType = {
  component: React.FC;
  label: string;
  id: string;
  path: string;
};

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
  documentation: {
    component: Documentation,
    label: 'Documentation',
    id: 'documentation',
    path: 'documentation',
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
  notFound: {
    component: NotFoundView,
    label: 'Not Found',
    id: 'notFound',
    path: '*',
  } as RouteType,
};

export default routes;
