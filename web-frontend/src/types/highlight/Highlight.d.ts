export default interface Highlight {
  isActive: boolean;
  onHover: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  show: () => void;
  hide: () => void;
  add: (id: string) => void;
  remove: (id: string) => void;
}
