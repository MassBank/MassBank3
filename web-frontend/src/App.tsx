import './App.scss';

import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './elements/footer/Footer';
import Body from './elements/body/Body';
import Header from './elements/header/Header';
import { HighlightProvider } from './highlight/Index';

function App() {
  return (
    <div className="app">
      <Router>
        <HighlightProvider>
          <Header />
          <Body />
          <Footer />
        </HighlightProvider>
      </Router>
    </div>
  );
}

export default App;
