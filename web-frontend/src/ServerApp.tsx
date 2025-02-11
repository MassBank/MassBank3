import { renderToString } from 'react-dom/server';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { StaticRouter } from 'react-router-dom';
import { propertiesContext } from './context/properties/properties';
import PropertiesContextProps from './types/PropertiesContextProps';
import App from './App';

interface IRenderProps {
  path: string;
  props: PropertiesContextProps;
}

export const render = ({ path, props }: IRenderProps) => {
  // SSR Render
  const cache = createCache();
  const html = renderToString(
    <StyleProvider cache={cache}>
      <propertiesContext.Provider value={props ?? {}}>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </propertiesContext.Provider>
    </StyleProvider>,
  );

  // Grab style from cache
  const styleText = extractStyle(cache);
  const head = styleText;

  return { head, html };
};
