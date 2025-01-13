import { message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Molecule } from 'openchemlib';
import { MouseEvent, useCallback, useMemo } from 'react';
import { SmilesSvgRenderer } from 'react-ocl/minimal';

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
      const svg = mol.toSVG(imageWidth, imageHeight, undefined, {
        autoCrop: true,
        autoCropMargin: 5,
        suppressChiralText: true,
        suppressCIPParity: true,
        suppressESR: true,
      });

      try {
        await navigator.clipboard.writeText(svg);
        message.success('Copied molecule SVG string to clipboard');
      } catch (error) {
        message.error('Failed to copy molecule SVG string to clipboard');
      }
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
