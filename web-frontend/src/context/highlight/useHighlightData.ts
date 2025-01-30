import { createContext, useContext } from 'react';
import HighlightContextProps from '../../types/highlight/HighlightContextProps';

const emptyState: HighlightContextProps = {
  highlight: {
    highlights: new Set<string>(),
    highlighted: new Set<string>(),
    source: undefined,
  },
  dispatch: () => null,
  remove: () => null,
};

const highlightContext = createContext<HighlightContextProps>(emptyState);

function useHighlightData() {
  return useContext(highlightContext);
}

export { highlightContext, useHighlightData };
