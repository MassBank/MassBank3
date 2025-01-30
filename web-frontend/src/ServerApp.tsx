import { renderToString } from 'react-dom/server';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { StaticRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import Routing from './elements/routes/Routing';
import { propertiesContext } from './context/properties/properties';
import PropertiesContextProps from './types/PropertiesContextProps';
import { HighlightProvider } from './context/highlight/HighlightProvider';

interface IRenderProps {
  path: string;
  props: PropertiesContextProps;
}

export const render = ({ path, props }: IRenderProps) => {
  // SSR Render
  const cache = createCache();
  const html = renderToString(
    <StrictMode>
      <StyleProvider cache={cache}>
        <propertiesContext.Provider value={props ?? {}}>
          <HighlightProvider>
            <StaticRouter location={path}>
              <Routing />
            </StaticRouter>
          </HighlightProvider>
        </propertiesContext.Provider>
      </StyleProvider>
    </StrictMode>,
  );

  // Grab style from cache
  const styleText = extractStyle(cache);
  const head = styleText;

  return { head, html };
};
