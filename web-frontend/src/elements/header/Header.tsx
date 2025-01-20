import './Header.scss';

import routes from '../../constants/routes';
import { Link, useLocation } from 'react-router-dom';
import { Button, Menu, MenuProps } from 'antd';
import { Header as HeaderAntD } from 'antd/es/layout/layout';

function Header() {
  const location = useLocation();

  const url = import.meta.env.VITE_MB3_BASE_URL;

  type MenuItem = Required<MenuProps>['items'][number];

  const logoLink: MenuItem = {
    key: 'logo-link',
    label: (
      <Button
        key="logo-li"
        style={{
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 'none',
        }}
      >
        <Link to={url} target="_self">
          <img
            src={import.meta.env.VITE_MB3_BASE_URL + '/logos/logo.svg'}
            alt="MassBank Europe"
            style={{ height: 50 }}
          />
        </Link>
      </Button>
    ),
  };

  const routeLinks: MenuItem[] = Object.keys(routes)
    .filter(
      (k) =>
        k !== routes.notFound.id &&
        k !== routes.home.id &&
        k !== routes.accessionPrevious.id &&
        k !== routes.sitemap.id,
    )
    .map((k) => {
      const route = routes[k];
      return {
        key: route.path,
        label: (
          <Button
            key={route.path + '-li'}
            style={{
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Link
              to={route.path as string}
              style={
                route.path == location.pathname
                  ? { color: 'blue', fontSize: 16 }
                  : { fontSize: 16 }
              }
            >
              {route.label}
            </Link>
          </Button>
        ),
      } as MenuItem;
    });

  const items: MenuItem[] = [logoLink, ...routeLinks];

  return (
    <HeaderAntD
      style={{
        width: '100%',
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Menu
        mode="horizontal"
        defaultSelectedKeys={['logo-link']}
        items={items}
        style={{
          width: '100%',
          height: 60,
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      />
    </HeaderAntD>
  );
}

export default Header;
