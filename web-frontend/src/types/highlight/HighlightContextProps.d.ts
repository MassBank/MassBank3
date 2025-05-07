import HighlightAction from './HighlightAction';
import HighlightState from './HighlightState';

interface HighlightContextProps {
  highlight: HighlightState;

  dispatch: (props: HighlightAction) => void;
  remove: () => void;
}

export default HighlightContextProps;
