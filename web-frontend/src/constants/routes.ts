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
  element: JSX.Element;
  label: string;
}

interface ifc2 {
  [key: string]: ifc1;
}

const routes: ifc2 = {
  home: { path: '/', element: Home(), label: 'Home' },
  search: { path: '/search', element: Search(), label: 'Search' },
  content: { path: '/content', element: Content(), label: 'Content' },
  download: { path: '/download', element: Download(), label: 'Download' },
  accession: { path: '/accession', element: Accession(), label: 'Accession' },
  documentation: {
    path: '/documentation',
    element: Documentation(),
    label: 'Documentation',
  },
  about: { path: '/about', element: About(), label: 'About' },
  news: { path: '/news', element: News(), label: 'News' },
  notFound: { path: '*', element: NotFound(), label: 'Not Found' },
};

export default routes;
