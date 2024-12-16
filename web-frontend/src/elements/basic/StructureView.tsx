import { Content } from 'antd/es/layout/layout';
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
      <Content
        onDoubleClick={onDoubleClick}
        style={{
          width: imageWidth,
          height: imageHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SmilesSvgRenderer
          smiles={smiles}
          width={imageWidth}
          height={imageHeight}
          autoCrop={true}
          autoCropMargin={5}
        />
      </Content>
    ),
    [imageHeight, imageWidth, onDoubleClick, smiles],
  );
}

export default StructureView;
