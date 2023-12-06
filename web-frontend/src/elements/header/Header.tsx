import routes from '../../constants/routes';
import './Header.scss';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const logoLink = (
    <li className="custom-li" key="logo-li">
      {/* <Link to="/" className="link"> */}
      <img src="/logos/logo.svg" alt="MassBank Europe" />
      {/* </Link> */}
    </li>
  );

  const routeLinks = Object.keys(routes)
    .filter((r) => r != 'notFound')
    .map((r) => {
      const route = routes[r];
      return (
        <li className="custom-li" key={route.path + '-li'}>
          <Link
            to={route.path}
            className="link"
            style={route.path == location.pathname ? { color: 'blue' } : {}}
          >
            {route.label}
          </Link>
        </li>
      );
    });

  const links = [logoLink].concat(routeLinks);

  return (
    <div className="header-panel">
      <ul className="custom-ul">{links}</ul>
    </div>
  );
}

export default Header;
