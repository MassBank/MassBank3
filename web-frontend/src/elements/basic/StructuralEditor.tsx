import './StructuralEditor.scss';

import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { StructureEditor } from 'react-ocl/full';
import { useDropzone } from 'react-dropzone';
import { Molecule } from 'openchemlib';
import Button from './Button';
import Input from './Input';

interface InputProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (molfile: string) => void;
  width?: number;
  height?: number;
}

function StructuralEditor({
  onChange = () => {},
  width = 400,
  height = 600,
}: InputProps) {
  const [smiles, setSmiles] = useState<string | undefined>();
  const [molfile, setMolfile] = useState<string | undefined>();
  const [structureKey, setStructureKey] = useState<number>(Math.random());
  const [error, setError] = useState<string | undefined>();

  const handleOnChangeStructure = useCallback(
    (_molfile: string, molecule: Molecule) => {
      setMolfile(_molfile);
      onChange(_molfile);
      setSmiles(molecule.toSmiles());
    },
    [onChange],
  );

  const handleOnChangeSmilesInput = useCallback(
    (value: string) => setSmiles(value),
    [],
  );

  const handleOnSetSmiles = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (smiles && smiles.trim().length > 0) {
        try {
          const molecule = Molecule.fromSmiles(smiles);
          const _molfile = molecule.toMolfile();
          handleOnChangeStructure(_molfile, molecule);
          setStructureKey(Math.random());
          setError(undefined);
        } catch (error) {
          setError('Invalid SMILES');
        }
      }
    },
    [handleOnChangeStructure, smiles],
  );

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const _molfile = reader.result as string;
        try {
          const mol = Molecule.fromMolfile(_molfile);
          handleOnChangeStructure(mol.toMolfileV3(), mol);
          setStructureKey(Math.random());
          setError(undefined);
        } catch (error) {
          setError('Invalid MOL file');
        }
      };
      reader.readAsText(file);
    },
    [handleOnChangeStructure],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noKeyboard: true,
  });

  const structureEditor = useMemo(
    () => (
      <StructureEditor
        width={width}
        height={width}
        onChange={handleOnChangeStructure}
        initialMolfile={molfile}
        key={structureKey}
      />
    ),
    [handleOnChangeStructure, molfile, structureKey, width],
  );

  return useMemo(
    () => (
      <div
        className="structure-editor-container"
        style={{ width, height }}
        {...{ ...getRootProps(), onClick: () => {} }}
      >
        <div className="structure-editor-container">{structureEditor}</div>
        <label className="or-label">OR</label>
        <div className="smiles-input-container">
          <Input
            type="text"
            label="SMILES:"
            onChange={handleOnChangeSmilesInput}
            value={smiles}
            placeholder='e.g. "C=O"'
          />
          <Button
            child={'Set'}
            onClick={handleOnSetSmiles}
            buttonStyle={{ width: '100%' }}
          />
        </div>
        <label className="or-label">OR</label>
        <div
          className="dropzone-container"
          onClick={getRootProps().onClick}
          style={
            isDragActive
              ? {
                  color: 'blue',
                  border: '2px dashed orange',
                  fontWeight: 'bold',
                }
              : {}
          }
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <label>Drop the MOL file now</label>
          ) : (
            <label>Drag & drop a MOL file or click here</label>
          )}
        </div>
        {error && (
          <div className="error-label-container">
            <label>{error}</label>
          </div>
        )}
        <label className="or-label">OR</label>
        <Button
          child={'Load Example'}
          onClick={() => {
            const smiles =
              'C1(=C(C=CC(=C1)C=2(OC=3(C(C(C=2O)=O)=C(C=C(C=3)O)O)))O)(O)';
            const mol = Molecule.fromSmiles(smiles);
            const molfile = mol.toMolfileV3();
            handleOnChangeStructure(molfile, mol);
            setStructureKey(Math.random());
          }}
          style={{ marginBottom: '10px' }}
        />
      </div>
    ),
    [
      error,
      getInputProps,
      getRootProps,
      handleOnChangeSmilesInput,
      handleOnChangeStructure,
      handleOnSetSmiles,
      height,
      isDragActive,
      smiles,
      structureEditor,
      width,
    ],
  );
}

export default StructuralEditor;
