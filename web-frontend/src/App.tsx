import { useEffect, useState } from 'react';
import Routing from './elements/routes/Routing';
import { HighlightProvider } from './context/highlight/HighlightProvider';
import { ConfigProvider } from 'antd';

function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <ConfigProvider
      wave={{ disabled: true }}
      typography={{
        style: { fontSize: 15 },
      }}
    >
      <HighlightProvider>
        <Routing />
      </HighlightProvider>
    </ConfigProvider>
  );
}

export default App;
