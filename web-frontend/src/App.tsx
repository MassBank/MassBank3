import { useEffect, useState } from 'react';
import Routing from './elements/routes/Routing';
import { HighlightProvider } from './context/highlight/HighlightProvider';

function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <HighlightProvider>
      <Routing />
    </HighlightProvider>
  );
}

export default App;
