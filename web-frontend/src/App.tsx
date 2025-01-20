import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { HighlightProvider } from './highlight/Index';
import Routing from './elements/routes/Routing';

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
          <Routing />
        </Layout>
      </HighlightProvider>
    </BrowserRouter>
  );
};

export default App;
