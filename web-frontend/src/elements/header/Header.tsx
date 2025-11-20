import routes from '../../constants/routes';
import { Button } from 'antd';
import { useLocation, useSearchParams } from 'react-router-dom';
import { usePropertiesContext } from '../../context/properties/properties';
import { CSSProperties, useMemo } from 'react';
import logo from '../../assets/logo.svg';
import AccessionSearchInputField from '../common/AccessionSearchInputField';
import HeaderTemplate from '../basic/HeaderTemplate';
import MenuItem from '../../types/MenuItem';
import { CaretDownOutlined } from '@ant-design/icons';

const backgroundColor: CSSProperties['backgroundColor'] = 'rgb(223, 223, 223)';

type InputProps = {
  height: CSSProperties['height'];
};

function Header({ height }: InputProps) {
  const location = useLocation();
  const { baseUrl } = usePropertiesContext();

  const [searchParams] = useSearchParams();
  const accession = searchParams.get('id');

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
            marginRight: 5,
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
            route.id === routes.search.id ||
            route.id === routes.content.id ||
            route.id === routes.service.id,
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
                  fontWeight: path === location.pathname ? 550 : 'inherit',
                  height:
                    typeof height === 'number'
                      ? height - 5
                      : `calc(${height} - 5px)`,
                  backgroundColor,
                }}
              >
                <a href={path} target="_self">
                  {route.label}
                </a>
              </Button>
            ),
          } as MenuItem;
        })
        .concat([
          {
            key: 'more',
            label: <CaretDownOutlined />,
            style: {
              backgroundColor,
              height:
                typeof height === 'number'
                  ? height - 5
                  : `calc(${height} - 5px)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            children: Object.values(routes)
              .filter(
                (route) =>
                  route.id === routes.documentation.id ||
                  route.id === routes.news.id ||
                  route.id === routes.about.id,
              )
              .map((route) => {
                const path = baseUrl + '/' + route.path;
                return {
                  key: path,
                  label: (
                    <Button
                      type="link"
                      key={path + '-li'}
                      style={{ padding: 0, margin: 0 }}
                    >
                      <a href={path} target="_self">
                        {route.label}
                      </a>
                    </Button>
                  ),
                } as MenuItem;
              }),
          },
        ])
        .concat([
          {
            key: 'accession-search-field',
            style: { cursor: 'default' },
            label: (
              <AccessionSearchInputField
                accession={accession ?? ''}
                disableLabel
                placeholderText="Search by Accession ID"
                inputStyle={{ width: '300px' }}
                style={{
                  width: '350px',
                  backgroundColor: 'transparent',
                }}
              />
            ),
          },
        ]) as MenuItem[],
    [accession, baseUrl, height, location.pathname],
  );

  return useMemo(() => {
    const items = [logoLink, ...routeLinks];

    return <HeaderTemplate height={height} items={items} />;
  }, [height, logoLink, routeLinks]);
}

export default Header;
