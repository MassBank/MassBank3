import { renderToString } from 'react-dom/server';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { StaticRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import Routing from './elements/routes/Routing';
import {
  PropertiesContext,
  PropertiesContextProps,
} from './context/properties/propertiesContext';

interface IRenderProps {
  path: string;
  props: PropertiesContextProps;
}

export const render = ({ path, props }: IRenderProps) => {
  console.log('render', path, props);
  // SSR Render
  const cache = createCache();
  const html = renderToString(
    <StrictMode>
      <StyleProvider cache={cache}>
        <StaticRouter location={path}>
          <PropertiesContext.Provider value={props ?? {}}>
            <Routing />
          </PropertiesContext.Provider>
        </StaticRouter>
      </StyleProvider>
    </StrictMode>,
  );

  // Grab style from cache
  const styleText = extractStyle(cache);
  const head = styleText;

  return { head, html };
};
