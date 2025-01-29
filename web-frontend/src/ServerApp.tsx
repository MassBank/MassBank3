import { renderToString } from 'react-dom/server';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { StaticRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import Routing from './elements/routes/Routing';

interface IRenderProps {
  path: string;
}

export const render = ({ path }: IRenderProps) => {
  // SSR Render
  const cache = createCache();
  const html = renderToString(
    <StrictMode>
      <StyleProvider cache={cache}>
        <StaticRouter location={path}>
          <Routing />
        </StaticRouter>
      </StyleProvider>
    </StrictMode>,
  );

  // Grab style from cache
  const styleText = extractStyle(cache);
  const head = styleText;

  return { head, html };
};
