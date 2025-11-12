import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CanvasEditorOnChangeMolecule, CanvasMoleculeEditor } from 'react-ocl';
import { Molecule } from 'openchemlib';

import { QuestionCircleTwoTone, UploadOutlined } from '@ant-design/icons';
import { Form, UploadProps } from 'antd';
import { Button, Divider, Input } from 'antd';
import { RcFile } from 'antd/es/upload';
import { Content } from 'antd/es/layout/layout';
import SearchFields from '../../types/filterOptions/SearchFields';
import Dragger from 'antd/es/upload/Dragger';
import Tooltip from './Tooltip';
import Text from 'antd/es/typography/Text';
import defaultTooltipText from '../../constants/defaultTooltipText';
import Placeholder from './Placeholder';

const heights = {
  divider: 25,
  input: 35,
  uploadButton: 30,
  uploadError: 30,
  marginTopBottomDivider: 5,
};

interface InputProps {
  initialSMILES?: string;
  width?: number | string;
  height?: number;
  insertPlaceholder?: (
    e: KeyboardEvent<HTMLElement>,
    values: SearchFields,
  ) => void;
}

function StructuralEditor({
  initialSMILES,
  width,
  height,
  insertPlaceholder = () => {},
}: InputProps) {
  const formInstance = Form.useFormInstance<SearchFields>();
  const { getFieldValue, setFieldValue } = formInstance;

  const [smiles, setSmiles] = useState<string | null>(null);
  const [molfile, setMolfile] = useState<string | null>(null);
  const [structureKey, setStructureKey] = useState<number>(Math.random());
  const [errorSmiles, setErrorSmiles] = useState<string | null>(null);
  const [errorMolfileImport, setErrorMolfileImport] = useState<string | null>(
    null,
  );

  const handleOnChangeStructure = useCallback(
    (_molfile: string) => {
      setMolfile(_molfile);
      const smi = Molecule.fromMolfile(_molfile).toIsomericSmiles();
      setSmiles(smi);
      setFieldValue(['compoundSearchFilterOptions', 'structure'], smi);
      setErrorMolfileImport(null);
    },
    [setFieldValue],
  );

  const handleOnSetSmiles = useCallback(() => {
    const _smiles = getFieldValue(['compoundSearchFilterOptions', 'structure']);
    if (_smiles && _smiles.trim().length > 0) {
      try {
        const mol = Molecule.fromSmiles(_smiles);
        const _molfile = mol.toMolfileV3();
        handleOnChangeStructure(_molfile);
        setStructureKey(Math.random());
        setErrorMolfileImport(null);
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

  const structureEditor = useMemo(() => {
    const editorHeight = height
      ? height -
        3 * heights.divider -
        heights.input -
        heights.uploadButton -
        heights.uploadError -
        6 * heights.marginTopBottomDivider
      : undefined;
    return (
      <Content
        style={{
          width: '100%',
          height: editorHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CanvasMoleculeEditor
          width={width}
          height={editorHeight}
          inputFormat="molfile"
          inputValue={molfile ?? ''}
          onChange={(e: CanvasEditorOnChangeMolecule) =>
            handleOnChangeStructure(e.getMolfile())
          }
          key={structureKey}
        />
      </Content>
    );
  }, [handleOnChangeStructure, height, molfile, structureKey, width]);

  const input = useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          height: heights.input,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Content style={{ width: 'calc(100% - 25px)' }}>
          <Form.Item<SearchFields>
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
                      setErrorSmiles(null);
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
              value={smiles ?? undefined}
              placeholder="C[C@H]([C@H]([C@@H]([C@H]1O)O)O)O[C@H]1OC1=C(c(cc2O)ccc2O)Oc2cc(O)cc(O)c2C1=O"
              style={{
                width: '100%',
                height: heights.input,
                backgroundColor: 'transparent',
              }}
              allowClear
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                insertPlaceholder(e, {
                  compoundSearchFilterOptions: {
                    structure:
                      'C[C@H]([C@H]([C@@H]([C@H]1O)O)O)O[C@H]1OC1=C(c(cc2O)ccc2O)Oc2cc(O)cc(O)c2C1=O',
                  },
                })
              }
            />
          </Form.Item>
        </Content>
        <Button
          children={'Set'}
          onClick={handleOnClickSetSmiles}
          style={{
            width: 50,
            height: heights.input,
            backgroundColor: 'transparent',
          }}
          disabled={errorSmiles !== null}
        />
        <Tooltip
          title={
            'Enter a SMILES to be used during a substructure search.' +
            ' ' +
            defaultTooltipText
          }
        >
          <QuestionCircleTwoTone
            style={{
              width: '25px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Tooltip>
      </Content>
    ),
    [errorSmiles, handleOnClickSetSmiles, insertPlaceholder, smiles],
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
          const _smiles = mol.toIsomericSmiles();
          if (_smiles.trim() === '') {
            throw 'Invalid MOL or SD file';
          }
          handleOnChangeStructure(_molfile);
          setStructureKey(Math.random());
          setErrorMolfileImport(null);
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
        maxHeight: heights.uploadButton,
        minHeight: heights.uploadButton,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
      <Content style={{ width, height, overflowY: 'scroll' }}>
        <Divider
          style={{
            borderColor: 'grey',
            marginTop: heights.marginTopBottomDivider,
            marginBottom: heights.marginTopBottomDivider,
            height: heights.divider,
          }}
        >
          Draw Structure
        </Divider>
        {structureEditor}
        <Divider
          style={{
            borderColor: 'grey',
            marginTop: heights.marginTopBottomDivider,
            marginBottom: heights.marginTopBottomDivider,
            height: heights.divider,
          }}
        >
          Enter SMILES
        </Divider>
        {input}
        <Divider
          style={{
            borderColor: 'grey',
            marginTop: heights.marginTopBottomDivider,
            marginBottom: heights.marginTopBottomDivider,
            height: heights.divider,
          }}
        >
          Upload MOL/SDF
        </Divider>
        <Content
          style={{
            width: '100%',
            height: heights.uploadButton + heights.uploadError,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Dragger {...props}>
            <UploadOutlined />
            <Text>Drag&Drop or click here</Text>
          </Dragger>
          <Placeholder
            style={{
              height: heights.uploadError,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            child={
              errorMolfileImport ? (
                <label style={{ color: 'red' }}>{errorMolfileImport}</label>
              ) : (
                ''
              )
            }
          />
        </Content>
      </Content>
    ),
    [errorMolfileImport, height, input, props, structureEditor, width],
  );
}

export default StructuralEditor;
