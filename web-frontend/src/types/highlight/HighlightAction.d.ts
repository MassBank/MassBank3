import HighlightEvent from './HightlightEvent';

type HighlightAction = {
  type: HighlightEvent;
  payload?: {
    convertedHighlights?: Set<string>;
    id?: string;
    source?: string;
  };
};

export default HighlightAction;
