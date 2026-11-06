import { useEffect, useState } from 'react';
import Routing from './elements/routes/Routing';
import { HighlightProvider } from './context/highlight/HighlightProvider';
import { ConfigProvider } from 'antd';

type InputProps = {
  nonce: string;
};

function App({ nonce }: InputProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function hydrate() {
      setHydrated(true);
    }
    hydrate();
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <ConfigProvider
      csp={{ nonce }}
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
