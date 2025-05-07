interface HighlightState {
  highlights: Set<string>;
  highlighted: Set<string>;
  source?: string;
}

export default HighlightState;
