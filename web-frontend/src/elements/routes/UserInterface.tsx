import { Content } from 'antd/es/layout/layout';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { JSX, useMemo } from 'react';
import { Layout } from 'antd';

const headerHeight = 60;
const footerHeight = 50;

type InputProps = {
  body: JSX.Element;
};

function UserInterface({ body }: InputProps) {
  return useMemo(
    () => (
      <Layout style={{ width: '100vw', height: '100vh' }}>
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Header height={headerHeight} />
          <Content
            style={{
              width: '100%',
              height: `calc(100% - ${headerHeight} - ${footerHeight})`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {body}
          </Content>
          <Footer height={footerHeight} />
        </Content>
      </Layout>
    ),
    [body],
  );
}

export default UserInterface;
