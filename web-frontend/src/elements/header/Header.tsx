import routes from '../../constants/routes';
import './Header.scss';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const url =
    import.meta.env.VITE_MB3_FRONTEND_URL + import.meta.env.VITE_MB3_BASE_URL;
  const logoLink = (
    <li className="custom-li" key="logo-li">
      <a href={url} target="_self">
        <img
          src={import.meta.env.VITE_MB3_BASE_URL + '/logos/logo.svg'}
          alt="MassBank Europe"
        />
      </a>
    </li>
  );

  const routeLinks = Object.keys(routes)
    .filter((r) => r !== 'notFound' && r !== 'home')
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
