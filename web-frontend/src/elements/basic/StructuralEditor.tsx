import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { StructureEditor } from 'react-ocl/full';
import { Molecule } from 'openchemlib';

import { UploadOutlined } from '@ant-design/icons';
import { Form, UploadProps } from 'antd';
import { Button, Col, Divider, Input, Row } from 'antd';
import { RcFile } from 'antd/es/upload';
import { Content } from 'antd/es/layout/layout';
import SearchFields from '../../types/filterOptions/SearchFields';
import Dragger from 'antd/es/upload/Dragger';

interface InputProps {
  initialSMILES?: string;
  width?: number;
  height?: number;
}

function StructuralEditor({ initialSMILES, width, height }: InputProps) {
  const formInstance = Form.useFormInstance<SearchFields>();
  const { getFieldValue, setFieldValue } = formInstance;

  const [smiles, setSmiles] = useState<string | undefined>();
  const [molfile, setMolfile] = useState<string | undefined>();
  const [structureKey, setStructureKey] = useState<number>(Math.random());
  const [errorSmiles, setErrorSmiles] = useState<string | undefined>();
  const [errorMolfileImport, setErrorMolfileImport] = useState<
    string | undefined
  >();

  const handleOnChangeStructure = useCallback(
    (_molfile: string, molecule: Molecule) => {
      const _smiles = molecule.toIsomericSmiles();
      setSmiles(_smiles);
      setMolfile(_molfile);
      setFieldValue(['compoundSearchFilterOptions', 'structure'], _smiles);
      setErrorMolfileImport(undefined);
    },
    [setFieldValue],
  );

  const handleOnSetSmiles = useCallback(() => {
    const _smiles = getFieldValue(['compoundSearchFilterOptions', 'structure']);
    if (_smiles && _smiles.trim().length > 0) {
      try {
        const molecule = Molecule.fromSmiles(_smiles);
        const _molfile = molecule.toMolfileV3();
        handleOnChangeStructure(_molfile, molecule);
        setStructureKey(Math.random());
        setErrorMolfileImport(undefined);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        /* empty */
      }
    }
  }, [getFieldValue, handleOnChangeStructure]);

  const handleOnClickSetSmiles = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      handleOnSetSmiles();
    },
    [handleOnSetSmiles],
  );

  useEffect(() => {
    if (initialSMILES) {
      setFieldValue(
        ['compoundSearchFilterOptions', 'structure'],
        initialSMILES,
      );
      handleOnSetSmiles();
    }
  }, [handleOnSetSmiles, initialSMILES, setFieldValue]);

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

  const input = useMemo(
    () => (
      <Form.Item
        name={['compoundSearchFilterOptions', 'structure']}
        style={{
          width: '100%',
          height: '100%',
        }}
        rules={[
          {
            required: false,
            validator: async (_, value) => {
              if (value && value.trim().length > 0) {
                try {
                  Molecule.fromSmiles(value);
                  setErrorSmiles(undefined);
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (err) {
                  setErrorSmiles('Invalid SMILES');
                  return Promise.reject(new Error('Invalid SMILES'));
                }
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          type="text"
          addonBefore="SMILES:"
          addonAfter={
            <Button
              children={'Set'}
              onClick={handleOnClickSetSmiles}
              style={{
                width: '100%',
                height: 30,
                backgroundColor: 'transparent',
                border: 'none',
              }}
              disabled={errorSmiles !== undefined}
            />
          }
          value={smiles}
          placeholder='e.g. "C=O"'
          style={{
            width: '100%',
            backgroundColor: 'transparent',
          }}
          allowClear
        />
      </Form.Item>
    ),
    [errorSmiles, handleOnClickSetSmiles, smiles],
  );

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const _molfile = new TextDecoder().decode(buffer);

        try {
          const mol = Molecule.fromMolfile(_molfile);
          if (mol.toSmiles().trim() === '') {
            throw 'Invalid MOL or SD file';
          }
          handleOnChangeStructure(mol.toMolfileV3(), mol);
          setStructureKey(Math.random());
          setErrorMolfileImport(undefined);
        } catch (error: unknown) {
          setErrorMolfileImport(error as string);
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [handleOnChangeStructure],
  );

  const props: UploadProps = useMemo(() => {
    return {
      name: 'file',
      style: {
        width: '100%',
        height: 30,
      },
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
        {input}
        <Divider style={{ borderColor: 'grey' }}>OR</Divider>
        <Content
          style={{
            width: '100%',
            height: '100%',
            textAlign: 'center',
          }}
        >
          <Dragger {...props}>
            <Row>
              <Col span={4}>
                <UploadOutlined />
              </Col>
              <Col span={20}>Upload MOL/SDF (Drag&Drop or Click)</Col>
            </Row>
          </Dragger>
          {errorMolfileImport && (
            <label style={{ color: 'red' }}>{errorMolfileImport}</label>
          )}
        </Content>
      </Content>
    ),
    [errorMolfileImport, input, props, structureEditor],
  );
}

export default StructuralEditor;
