import './Header.scss';

import routes from '../../constants/routes';
import { Button, Menu, MenuProps } from 'antd';
import { Header as HeaderAntD } from 'antd/es/layout/layout';
import { useLocation } from 'react-router-dom';
import { usePropertiesContext } from '../../context/properties/properties';
import { CSSProperties, useMemo } from 'react';
import logo from '../../assets/logo.svg';

const backgroundColor: CSSProperties['backgroundColor'] = 'rgb(223, 223, 223)';

type InputProps = {
  height: CSSProperties['height'];
};

function Header({ height }: InputProps) {
  const location = useLocation();
  const { baseUrl } = usePropertiesContext();

  type MenuItem = Required<MenuProps>['items'][number];

  const logoLink: MenuItem = useMemo(() => {
    return {
      key: 'logo-link',
      label: (
        <Button
          type="link"
          key="logo-li"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height:
              typeof height === 'number' ? height - 5 : `calc(${height} - 5px)`,
            backgroundColor,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <a href={baseUrl + '/'} target="_self">
            <img
              src={logo}
              alt="MassBank Europe"
              style={{
                height:
                  typeof height === 'number'
                    ? height - 5
                    : `calc(${height} - 5px)`,
                padding: 5,
              }}
            />
          </a>
        </Button>
      ),
    };
  }, [baseUrl, height]);

  const routeLinks: MenuItem[] = useMemo(
    () =>
      Object.values(routes)
        .filter(
          (route) =>
            route.id !== routes.notFound.id &&
            route.id !== routes.home.id &&
            route.id !== routes.accession.id &&
            route.id !== routes.accessionNext.id,
        )
        .map((route) => {
          const path = baseUrl + '/' + route.path;
          return {
            key: path,
            label: (
              <Button
                type="link"
                key={path + '-li'}
                style={{
                  color: path === location.pathname ? 'blue' : 'black',
                  fontWeight: path === location.pathname ? 600 : 'inherit',
                  height:
                    typeof height === 'number'
                      ? height - 5
                      : `calc(${height} - 5px)`,
                  backgroundColor,
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <a href={path} target="_self">
                  {route.label}
                </a>
              </Button>
            ),
          } as MenuItem;
        }),
    [baseUrl, height, location.pathname],
  );

  return useMemo(() => {
    const items = [logoLink, ...routeLinks];
    return (
      <HeaderAntD
        style={{
          width: '100%',
          height,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor,
          padding: 0,
        }}
      >
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['logo-link']}
          items={items}
          style={{
            width: '100%',
            height,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor,
          }}
        />
      </HeaderAntD>
    );
  }, [height, logoLink, routeLinks]);
}

export default Header;
