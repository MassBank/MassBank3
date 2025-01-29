import './Header.scss';

import routes from '../../constants/routes';
import { Button, Menu, MenuProps } from 'antd';
import { Header as HeaderAntD } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';

function Header() {
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
        <Link to={routes.home.path} target="_self">
          <img
            src="logos/logo.svg"
            alt="MassBank Europe"
            style={{ height: 50 }}
          />
        </Link>
      </Button>
    ),
  };

  const routeLinks: MenuItem[] = Object.values(routes)
    .filter(
      (route) =>
        route.id !== routes.notFound.id &&
        route.id !== routes.home.id &&
        route.id !== routes.accessionPrevious.id,
    )
    .map((route) => {
      return {
        key: route.path,
        label: (
          <a href={route.path as string} target="_self">
            <Button
              key={route.path + '-li'}
              style={{
                border: 'none',
                boxShadow: 'none',
                // color: route.path == location.pathname ? "blue" : undefined,
              }}
            >
              {route.label}
            </Button>
          </a>
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
