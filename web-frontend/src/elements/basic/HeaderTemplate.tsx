import './HeaderTemplate.scss';

import { CSSProperties, useMemo } from 'react';
import { Menu } from 'antd';
import { Header as HeaderAntD } from 'antd/es/layout/layout';
import MenuItem from '../../types/MenuItem';

const defaultBackgroundColor: CSSProperties['backgroundColor'] =
  'rgb(223, 223, 223)';

type InputProps = {
  height: CSSProperties['height'];
  items: MenuItem[];
  backgroundColor?: CSSProperties['backgroundColor'];
};

function HeaderTemplate({
  height,
  items,
  backgroundColor = defaultBackgroundColor,
}: InputProps) {
  return useMemo(
    () => (
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
    ),
    [backgroundColor, height, items],
  );
}

export default HeaderTemplate;
