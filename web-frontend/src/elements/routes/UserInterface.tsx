import { Content } from 'antd/es/layout/layout';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { useMemo, JSX } from 'react';
import { HighlightProvider } from '../../context/highlight/HighlightProvider';

type InputProps = {
  body: JSX.Element;
};

function UserInterface({ body }: InputProps) {
  const userInterface = useMemo(
    () => (
      <Content
        style={{
          width: '100vw',
          height: '100vh',
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

  return <HighlightProvider>{userInterface}</HighlightProvider>;
}

export default UserInterface;
