import './Header.scss';

import routes from '../../constants/routes';
import { Link, useLocation } from 'react-router-dom';
import { Button, Menu, MenuProps } from 'antd';
import { Header as HeaderAntD } from 'antd/es/layout/layout';

function Header() {
  const location = useLocation();

  const url =
    import.meta.env.VITE_MB3_FRONTEND_URL + import.meta.env.VITE_MB3_BASE_URL;

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
    .filter((r) => r !== 'notFound' && r !== 'home')
    .map((r) => {
      const route = routes[r];
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
              to={route.path}
              style={route.path == location.pathname ? { color: 'blue' } : {}}
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
