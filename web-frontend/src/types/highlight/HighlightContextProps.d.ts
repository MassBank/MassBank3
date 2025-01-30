interface HighlightContextProps {
  highlight: HighlightState;

  dispatch: (props: {
    type: HighlightActions;
    payload?: {
      convertedHighlights: Set<string>;
      id?: string;
      source?: string;
    };
  }) => void;
  remove: () => void;
}

export default HighlightContextProps;
