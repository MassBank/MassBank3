import React from 'react';
import AboutView from '../elements/routes/pages/about/AboutView';
import AccessionView from '../elements/routes/pages/accession/AccessionView';
import ContentView from '../elements/routes/pages/content/ContentView';
import HomeView from '../elements/routes/pages/home/HomeView';
import NewsView from '../elements/routes/pages/news/NewsView';
import NotFoundView from '../elements/routes/pages/notfound/NotFoundView';
import SearchView from '../elements/routes/pages/search/SearchView';
import SitemapIndex from '../elements/routes/pages/sitemap/SitemapIndex';

const baseUrl = import.meta.env.VITE_MB3_BASE_URL;

type RouteType = {
  component: React.FC;
  label: string;
  id: string;
  type: 'file' | 'userInterface';
  path: string;
};

const routes = {
  sitemap: {
    component: SitemapIndex,
    label: 'Sitemap Index',
    id: 'sitemapindex',
    type: 'file',
    path: baseUrl + 'sitemap/index.xml',
  } as RouteType,
  home: {
    component: HomeView,
    label: 'Home',
    id: 'home',
    type: 'userInterface',
    path: baseUrl,
  } as RouteType,
  search: {
    component: SearchView,
    label: 'Search',
    id: 'search',
    type: 'userInterface',
    path: baseUrl + 'search',
  } as RouteType,
  content: {
    component: ContentView,
    label: 'Content',
    id: 'content',
    type: 'userInterface',
    path: baseUrl + 'content',
  } as RouteType,
  accession: {
    component: AccessionView,
    label: 'Accession',
    id: 'accession',
    type: 'userInterface',
    path: baseUrl + 'recordDisplay',
  } as RouteType,
  accessionPrevious: {
    component: AccessionView,
    label: 'Previous Accession',
    id: 'accessionPrevious',
    type: 'userInterface',
    path: baseUrl + 'RecordDisplay',
  } as RouteType,
  news: {
    component: NewsView,
    label: 'News',
    id: 'news',
    type: 'userInterface',
    path: baseUrl + 'news',
  } as RouteType,
  about: {
    component: AboutView,
    label: 'About',
    id: 'about',
    type: 'userInterface',
    path: baseUrl + 'about',
  } as RouteType,
  notFound: {
    component: NotFoundView,
    label: 'Not Found',
    id: 'notFound',
    type: 'userInterface',
    path: baseUrl + '*',
  } as RouteType,
};

export default routes;
