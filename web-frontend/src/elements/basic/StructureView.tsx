import { useMemo } from 'react';
import { SmilesSvgRenderer } from 'react-ocl';

interface InputProps {
  smiles: string;
  imageWidth?: number;
  imageHeight?: number;
  onDoubleClick?: () => void;
}

function StructureView({
  smiles,
  imageWidth,
  imageHeight,
  onDoubleClick = () => {},
}: InputProps) {
  return useMemo(
    () => (
      <div onDoubleClick={onDoubleClick}>
        <SmilesSvgRenderer
          smiles={smiles}
          width={imageWidth}
          height={imageHeight}
          // autoCrop={true}
          // autoCropMargin={10}
        />
      </div>
    ),
    [imageHeight, imageWidth, onDoubleClick, smiles],
  );
}

export default StructureView;
