import { Content } from 'antd/es/layout/layout';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { useMemo } from 'react';

type InputProps = {
  body: JSX.Element;
};

function UserInterface({ body }: InputProps) {
  return useMemo(
    () => (
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
        <Header />
        {body}
        <Footer />
      </Content>
    ),
    [body],
  );
}

export default UserInterface;
