import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CommentsTable from './CommentsTable';

describe('CommentsTable', () => {
  it('renders complete comment values, including duplicates, as text', () => {
    const html = renderToStaticMarkup(
      createElement(CommentsTable, {
        comments: [
          'CONFIDENCE  Predicted',
          'NATIVE_RUN_ID file.mzML',
          '<script>alert(1)</script>',
          'Repeated comment',
          'Repeated comment',
        ],
        width: '100%',
        height: 'auto',
      }),
    );
    expect(html).toContain('CONFIDENCE  Predicted');
    expect(html).toContain('white-space:pre-wrap');
    expect(html).toContain('NATIVE_RUN_ID file.mzML');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html.match(/Repeated comment/g)).toHaveLength(2);
  });

  it('renders nothing when no comments are present', () => {
    for (const comments of [undefined, []]) {
      expect(
        renderToStaticMarkup(
          createElement(CommentsTable, {
            comments,
            width: '100%',
            height: 'auto',
          }),
        ),
      ).toBe('');
    }
  });
});
