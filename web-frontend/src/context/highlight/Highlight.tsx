import { useMemo, useCallback, useEffect } from 'react';
import Highlight from '../../types/highlight/Highlight';
import { useHighlightData } from './useHighlightData';

/**
 * @param {Array<string | number>}  highlights
 */
export default function useHighlight(
  highlights: (string | number)[],
  source?: string,
): Highlight {
  if (!Array.isArray(highlights)) {
    throw new Error('highlights must be an array');
  }
  const { dispatch, highlight } = useHighlightData();

  const convertedHighlights = useMemo(() => {
    const newHighlights = new Set<string>();
    for (const highlight of highlights) {
      if (typeof highlight !== 'string' && typeof highlight !== 'number') {
        throw new Error(`highlight key must be a string or number`);
      }
      if (highlight !== '') {
        newHighlights.add(String(highlight));
      }
    }
    return newHighlights;
  }, [highlights]);

  useEffect(() => {
    // if deletion of component then also delete its highlight information -> componentWillUnmount
    return () => {
      dispatch({
        type: 'HIDE',
        payload: { convertedHighlights: new Set() },
      });
    };
  }, [dispatch]);

  const isActive = useMemo(() => {
    for (const value of convertedHighlights) {
      if (highlight.highlighted.has(value)) {
        return true;
      }
    }
    return false;
  }, [convertedHighlights, highlight.highlighted]);

  const show = useCallback(() => {
    dispatch({
      type: 'SHOW',
      payload: {
        convertedHighlights,
        source,
      },
    });
  }, [dispatch, convertedHighlights, source]);

  const hide = useCallback(() => {
    dispatch({
      type: 'HIDE',
      payload: {
        convertedHighlights,
      },
    });
  }, [convertedHighlights, dispatch]);

  const add = useCallback(
    (id) => {
      dispatch({
        type: 'SHOW',
        payload: { convertedHighlights: new Set(), id },
      });
    },
    [dispatch],
  );

  const remove = useCallback(
    (id) => {
      dispatch({
        type: 'HIDE',
        payload: { convertedHighlights: new Set(), id },
      });
    },
    [dispatch],
  );

  return useMemo(() => {
    return {
      source,
      isActive,
      onHover: {
        onMouseEnter: show,
        onMouseLeave: hide,
      },
      show,
      hide,
      add,
      remove,
    };
  }, [add, hide, isActive, remove, show, source]);
}
