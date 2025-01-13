import { Content } from 'antd/es/layout/layout';
import { Molecule } from 'openchemlib';
import { MouseEvent, useCallback, useMemo } from 'react';
import { SmilesSvgRenderer } from 'react-ocl/minimal';
import copyTextToClipboard from '../../utils/copyTextToClipboard';

interface InputProps {
  smiles: string;
  imageWidth: number;
  imageHeight: number;
}

function StructureView({ smiles, imageWidth, imageHeight }: InputProps) {
  const handleOnCopy = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const mol = Molecule.fromSmiles(smiles);
      const svgString = mol.toSVG(imageWidth, imageHeight, undefined, {
        autoCrop: true,
        autoCropMargin: 5,
        suppressChiralText: true,
        suppressCIPParity: true,
        suppressESR: true,
      });

      copyTextToClipboard('Structure SVG String', svgString);
    },
    [imageHeight, imageWidth, smiles],
  );

  return useMemo(
    () => (
      <Content
        onDoubleClick={handleOnCopy}
        style={{
          minWidth: imageWidth,
          maxWidth: imageWidth,
          minHeight: imageHeight,
          maxHeight: imageHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
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
    [handleOnCopy, imageHeight, imageWidth, smiles],
  );
}

export default StructureView;
