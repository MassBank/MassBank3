import './App.scss';

import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './elements/footer/Footer';
import Body from './elements/body/Body';
import Header from './elements/header/Header';

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <Body />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
