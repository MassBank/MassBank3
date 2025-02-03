import { useEffect, useState } from 'react';
import Routing from './elements/routes/Routing';

function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return <Routing />;
}

export default App;
