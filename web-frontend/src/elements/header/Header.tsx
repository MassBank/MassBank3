import './Header.scss';

import routes from '../../constants/routes';
import { Button, Menu, MenuProps } from 'antd';
import { Header as HeaderAntD } from 'antd/es/layout/layout';
import { Link, useLocation } from 'react-router-dom';
import { usePropertiesContext } from '../../context/properties/properties';
import { useMemo } from 'react';
import logo from '../../assets/logo.svg';

function Header() {
  const location = useLocation();
  const { baseUrl } = usePropertiesContext();

  type MenuItem = Required<MenuProps>['items'][number];

  const logoLink: MenuItem = useMemo(() => {
    return {
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
          <Link to={baseUrl} target="_self">
            <img src={logo} alt="MassBank Europe" style={{ height: 50 }} />
          </Link>
        </Button>
      ),
    };
  }, [baseUrl]);

  const routeLinks: MenuItem[] = useMemo(
    () =>
      Object.values(routes)
        .filter(
          (route) =>
            route.id !== routes.notFound.id &&
            route.id !== routes.home.id &&
            route.id !== routes.accessionPrevious.id,
        )
        .map((route) => {
          const path = baseUrl + route.path;
          return {
            key: path,
            label: (
              <a href={path} target="_self">
                <Button
                  key={path + '-li'}
                  style={{
                    border: 'none',
                    boxShadow: 'none',
                    color: path == location.pathname ? 'blue' : undefined,
                  }}
                >
                  {route.label}
                </Button>
              </a>
            ),
          } as MenuItem;
        }),
    [baseUrl, location.pathname],
  );

  return useMemo(() => {
    const items = [logoLink, ...routeLinks];
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
  }, [logoLink, routeLinks]);
}

export default Header;
