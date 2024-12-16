import React from 'react';
import { Layout } from 'antd';
import Header from './elements/header/Header';
import { BrowserRouter } from 'react-router-dom';
import { HighlightProvider } from './highlight/Index';
import Footer from './elements/footer/Footer';
import Body from './elements/body/Body';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <HighlightProvider>
        <Layout
          style={{
            width: '100vw',
            height: '100vh',
          }}
        >
          <Header />
          <Body />
          <Footer />
        </Layout>
      </HighlightProvider>
    </BrowserRouter>
  );
};

export default App;
