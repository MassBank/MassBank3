import { ChangeEvent, MouseEvent, useCallback, useMemo, useState } from 'react';
import { StructureEditor } from 'react-ocl/full';
import { Molecule } from 'openchemlib';

import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Col, Divider, Input, Row, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { Content } from 'antd/es/layout/layout';

interface InputProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (molfile: string) => void;
  width?: number;
  height?: number;
}

function StructuralEditor({ onChange = () => {}, width, height }: InputProps) {
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
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setSmiles(e.target.value);
    },
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

  const structureEditor = useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StructureEditor
          width={width}
          height={height}
          onChange={handleOnChangeStructure}
          initialMolfile={molfile}
          key={structureKey}
        />
      </Content>
    ),
    [handleOnChangeStructure, height, molfile, structureKey, width],
  );

  const { Dragger } = Upload;

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const _molfile = new TextDecoder().decode(buffer);

        try {
          const mol = Molecule.fromMolfile(_molfile);
          handleOnChangeStructure(mol.toMolfileV3(), mol);
          setStructureKey(Math.random());
          setError(undefined);
        } catch (error) {
          setError('Invalid MOL file');
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [handleOnChangeStructure],
  );

  const props: UploadProps = useMemo(() => {
    return {
      name: 'file',
      multiple: false,
      showUploadList: false,
      accept: '.mol,.sdf,.sd',
      onDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();

        onDrop(Array.from(e.dataTransfer.files));
      },
      beforeUpload: async (file: RcFile) => {
        onDrop([file]);

        return false;
      },
    };
  }, [onDrop]);

  return useMemo(
    () => (
      <Content style={{ width: '100%', height: '100%' }}>
        {structureEditor}
        <Divider style={{ borderColor: 'grey' }}>OR</Divider>
        <Input
          type="text"
          addonBefore="SMILES:"
          addonAfter={
            <Button
              children={'Set'}
              onClick={handleOnSetSmiles}
              style={{
                width: '100%',
                height: 30,
                backgroundColor: 'transparent',
                border: 'none',
              }}
            />
          }
          onChange={handleOnChangeSmilesInput}
          value={smiles}
          placeholder='e.g. "C=O"'
          style={{
            width: '100%',
            backgroundColor: 'transparent',
          }}
          allowClear
        />
        <Divider style={{ borderColor: 'grey' }}>OR</Divider>
        <Dragger
          {...props}
          style={{
            width: '100%',
            height: 30,
          }}
        >
          <Row>
            <Col span={4}>
              <UploadOutlined />
            </Col>
            <Col span={20}>Drag & Drop a file here or click to upload</Col>
          </Row>
        </Dragger>
      </Content>
    ),
    [
      Dragger,
      handleOnChangeSmilesInput,
      handleOnSetSmiles,
      props,
      smiles,
      structureEditor,
    ],
  );
}

export default StructuralEditor;
