import { Molecule } from 'openchemlib';
import { useCallback } from 'react';
import { SmilesSvgRenderer } from 'react-ocl/minimal';
import FileSaver from 'file-saver';
const { saveAs } = FileSaver;
import ExportableContent from '../common/ExportableContent';

interface InputProps {
  smiles: string;
  imageWidth: number;
  imageHeight: number;
  disableExport?: boolean;
}

function StructureView({
  smiles,
  imageWidth,
  imageHeight,
  disableExport = false,
}: InputProps) {
  const defaultButtonWidth = 30;

  const handleOnDownload = useCallback(() => {
    const mol = Molecule.fromSmiles(smiles);
    const svgString = mol.toSVG(imageWidth, imageHeight, undefined, {
      autoCrop: true,
      autoCropMargin: 5,
      suppressChiralText: true,
      suppressCIPParity: true,
      suppressESR: true,
    });
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    saveAs(blob, 'structure_' + smiles + '.svg');
  }, [imageHeight, imageWidth, smiles]);

  const svgRenerer = (
    <SmilesSvgRenderer
      smiles={smiles}
      width={imageWidth - defaultButtonWidth}
      height={imageHeight}
      autoCrop={true}
      autoCropMargin={5}
    />
  );

  return disableExport ? (
    svgRenerer
  ) : (
    <ExportableContent
      title="Download structure as SVG"
      component={svgRenerer}
      mode="download"
      onClick={handleOnDownload}
      width={imageWidth}
      height={imageHeight}
      componentContainerStyle={{ width: '100%', justifyContent: 'center' }}
    />
  );
}

export default StructureView;
