import { useMemo, useReducer } from 'react';
import HighlightState from '../../types/highlight/HighlightState';
import HighlightContextProps from '../../types/highlight/HighlightContextProps';
import { highlightContext } from './useHighlightData';

const emptyState: HighlightContextProps = {
  highlight: {
    highlights: new Set<string>(),
    highlighted: new Set<string>(),
    source: undefined,
  },
  dispatch: () => null,
  remove: () => null,
};

function highlightReducer(state: HighlightState, action) {
  switch (action.type) {
    case 'SHOW': {
      const { convertedHighlights, source } = action.payload;

      const newState: HighlightState = {
        ...state,
      };
      for (const value of convertedHighlights) {
        if (value !== undefined) {
          newState.highlights.add(value);
        }
      }
      newState.highlighted = new Set(newState.highlights);
      newState.source = source;

      return newState;
    }
    case 'HIDE': {
      const { convertedHighlights } = action.payload;

      const newState: HighlightState = {
        ...state,
      };
      for (const value of convertedHighlights) {
        if (value !== undefined) {
          newState.highlights.delete(value);
        }
      }
      newState.highlighted = new Set(newState.highlights);
      newState.source = undefined;

      return newState;
    }
    default: {
      throw new Error(`unknown action type: ${action.type}`);
    }
  }
}

export function HighlightProvider({ children }: { children: React.ReactNode }) {
  const [highlight, dispatch] = useReducer(
    highlightReducer,
    emptyState.highlight,
  );

  const contextValue = useMemo(() => {
    function remove() {
      dispatch({
        type: 'HIDE',
        payload: { convertedHighlights: highlight.highlighted },
      });
    }
    return { highlight, dispatch, remove };
  }, [highlight]);

  return (
    <highlightContext.Provider value={contextValue}>
      {children}
    </highlightContext.Provider>
  );
}
