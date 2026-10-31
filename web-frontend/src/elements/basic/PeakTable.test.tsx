import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import PeakTable from './PeakTable';

it('displays zero-valued peaks instead of empty numeric cells', () => {
  const html = renderToStaticMarkup(
    createElement(PeakTable, {
      peaks: [
        { id: 'zero', mz: 0, intensity: 0, rel: 0 },
        { id: 'positive', mz: 74.0185, intensity: 1.25, rel: 1 },
      ],
      width: 400,
      height: 600,
    }),
  );
  const zeroRow = html.match(/<tr[^>]*data-row-key="zero"[\s\S]*?<\/tr>/)?.[0];
  expect(zeroRow).toContain('>0.0000</td>');
  expect(zeroRow).toContain('>0.00</td>');
  expect(zeroRow).toContain('>0</td>');
  expect(html).toContain('>74.0185</td>');
  expect(html).toContain('>1.25</td>');
});
