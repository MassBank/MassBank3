import React from "react";
import AboutView from "../elements/routes/pages/about/AboutView";
import AccessionView from "../elements/routes/pages/accession/AccessionView";
import ContentView from "../elements/routes/pages/content/ContentView";
import HomeView from "../elements/routes/pages/home/HomeView";
import NewsView from "../elements/routes/pages/news/NewsView";
import NotFoundView from "../elements/routes/pages/notfound/NotFoundView";
import SearchView from "../elements/routes/pages/search/SearchView";

const baseUrl = import.meta.env.VITE_MB3_BASE_URL;

type RouteType = {
  component: React.FC;
  label: string;
  id: string;
  path: string;
};

const routes = {
  home: {
    component: HomeView,
    label: "Home",
    id: "home",
    path: baseUrl,
  } as RouteType,
  search: {
    component: SearchView,
    label: "Search",
    id: "search",
    path: baseUrl + "search",
  } as RouteType,
  content: {
    component: ContentView,
    label: "Content",
    id: "content",
    path: baseUrl + "content",
  } as RouteType,
  accession: {
    component: AccessionView,
    label: "Accession",
    id: "accession",
    path: baseUrl + "recordDisplay",
  } as RouteType,
  accessionPrevious: {
    component: AccessionView,
    label: "Previous Accession",
    id: "accessionPrevious",
    path: baseUrl + "RecordDisplay",
  } as RouteType,
  news: {
    component: NewsView,
    label: "News",
    id: "news",
    path: baseUrl + "news",
  } as RouteType,
  about: {
    component: AboutView,
    label: "About",
    id: "about",
    path: baseUrl + "about",
  } as RouteType,
  notFound: {
    component: NotFoundView,
    label: "Not Found",
    id: "notFound",
    path: baseUrl + "*",
  } as RouteType,
};

export default routes;
