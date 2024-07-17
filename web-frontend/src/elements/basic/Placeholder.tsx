type InputProps = {
  child: string | JSX.Element;
  width: number;
  height: number;
};

function Placeholder({ child, width, height }: InputProps) {
  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {child}
    </div>
  );
}

export default Placeholder;
