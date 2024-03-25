import { useMemo } from 'react';
import { SmilesSvgRenderer } from 'react-ocl';

interface InputProps {
  smiles: string;
  imageWidth?: number;
  imageHeight?: number;
  onDoubleClick?: () => void;
  className?: string;
}

function StructureView({
  smiles,
  imageWidth,
  imageHeight,
  onDoubleClick = () => {},
  className = 'StructureView',
}: InputProps) {
  return useMemo(
    () => (
      <div className={className} onDoubleClick={onDoubleClick}>
        <SmilesSvgRenderer
          smiles={smiles}
          width={imageWidth}
          height={imageHeight}
          autoCrop={true}
          autoCropMargin={10}
        />
      </div>
    ),
    [className, imageHeight, imageWidth, onDoubleClick, smiles],
  );
}

export default StructureView;
