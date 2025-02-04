import { Content } from 'antd/es/layout/layout';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { JSX } from 'react';

const headerHeight = 60;
const footerHeight = 50;

type InputProps = {
  body: JSX.Element;
};

function UserInterface({ body }: InputProps) {
  const userInterface = (
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
  );

  return userInterface;
}

export default UserInterface;
