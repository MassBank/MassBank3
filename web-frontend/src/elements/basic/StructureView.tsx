import { Molecule, SmilesParser } from 'openchemlib';
import { useCallback, useMemo } from 'react';
import { MolfileSvgRenderer } from 'react-ocl/minimal';
import ExportableContent from '../common/ExportableContent';
import { Content } from 'antd/es/layout/layout';
import FileSaver from 'file-saver';
const { saveAs } = FileSaver;

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
  const extendedSmilesLabelHeight = 15;

  const adjustRGroups = useCallback(
    (smi: string): { molfile: string; rGroupLabel: string } => {
      const smilesParser = new SmilesParser({
        smartsMode: 'smiles',
        createSmartsWarnings: true,
      });
      try {
        const mol = smilesParser.parseMolecule(smi);
        const molfile = mol.toMolfileV3();
        let modMolfile = molfile;
        const rGroupCount = (molfile.match(/ A /g) || []).length;
        for (let i = 0; i < rGroupCount; i++) {
          modMolfile = modMolfile.replace(/ A /, ` R${i + 1} `);
        }
        const split = smi.split(' ');
        if (split.length > 1) {
          const rGroupLabel = split.slice(1).join(' ');
          const rGroupLabelMatch = rGroupLabel.match(/\|\$.*\$\|/g);
          if (rGroupLabelMatch !== null) {
            const rGroupLabelContent = rGroupLabel.substring(
              rGroupLabelMatch[0].length,
            );

            return { molfile: modMolfile, rGroupLabel: rGroupLabelContent };
          }

          return { molfile: modMolfile, rGroupLabel: rGroupLabel };
        }

        return { molfile: modMolfile, rGroupLabel: '' };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // console.error('Invalid SMILES string:', error);
      }

      return { molfile: '', rGroupLabel: '' };
    },
    [],
  );

  const handleOnDownload = useCallback(() => {
    const mol = Molecule.fromMolfile(adjustRGroups(smiles).molfile);
    const svgString = mol.toSVG(imageWidth, imageHeight, undefined, {
      autoCrop: true,
      autoCropMargin: 5,
      suppressChiralText: true,
      suppressCIPParity: true,
      suppressESR: true,
    });
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    saveAs(blob, 'structure_' + smiles + '.svg');
  }, [adjustRGroups, imageHeight, imageWidth, smiles]);

  return useMemo(() => {
    const { molfile, rGroupLabel } = adjustRGroups(smiles);
    const svgRenderer = (
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: imageWidth - defaultButtonWidth,
          height: imageHeight,
        }}
      >
        {molfile && molfile.length > 0 ? (
          <MolfileSvgRenderer
            molfile={molfile}
            width={imageWidth - defaultButtonWidth}
            height={
              imageHeight -
              (rGroupLabel && rGroupLabel.trim().length > 0
                ? extendedSmilesLabelHeight
                : 0)
            }
            autoCrop={true}
            autoCropMargin={5}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: imageWidth,
              height: imageHeight,
              fontStyle: 'italic',
              color: 'red',
              textAlign: 'center',
            }}
          >
            Invalid SMILES
          </div>
        )}
        {rGroupLabel && rGroupLabel.trim().length > 0 && (
          <div
            style={{
              textAlign: 'center',
              fontStyle: 'italic',
              color: 'brown',
              height: extendedSmilesLabelHeight,
            }}
          >
            {rGroupLabel}
          </div>
        )}
      </Content>
    );

    if (molfile && molfile.length) {
      return disableExport ? (
        svgRenderer
      ) : (
        <ExportableContent
          title="Download structure as SVG"
          component={svgRenderer}
          mode="download"
          onClick={handleOnDownload}
          width={imageWidth}
          height={imageHeight}
          componentContainerStyle={{ width: '100%', justifyContent: 'center' }}
        />
      );
    }

    return svgRenderer;
  }, [
    adjustRGroups,
    disableExport,
    handleOnDownload,
    imageHeight,
    imageWidth,
    smiles,
  ]);
}

export default StructureView;
