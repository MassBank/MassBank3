import { MouseEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { Button, Collapse, CollapseProps, UploadProps } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { Content } from 'antd/es/layout/layout';
import Dragger from 'antd/es/upload/Dragger';
import { RcFile } from 'antd/es/upload';
import { usePropertiesContext } from '../../../../context/properties/properties';
import validateRecord from '../../../../utils/request/validateRecord';

const rawTextPlaceholder =
  'ACCESSION: MSBNK-IPB_Halle-PB001341\n\
RECORD_TITLE: Rutin; LC-ESI-QTOF; MS2; CE:10 eV; [M+H]+\n\
DATE: 2016.01.19 (Created 2008.05.22, modified 2013.06.04)\n\
AUTHORS: Boettcher C, Institute of Plant Biochemistry, Halle, Germany\n\
LICENSE: CC BY-SA\n\
COMMENT: IPB_RECORD: 541\n\
COMMENT: CONFIDENCE confident structure\n\
CH$NAME: Rutin\n\
CH$NAME: 2-(3,4-dihydroxyphenyl)-5,7-dihydroxy-3-[(2S,3R,4S,5S,6R)-3,4,5-trihydroxy-6-[[(2R,3R,4R,5R,6S)-3,4,5-trihydroxy-6-methyloxan-2-yl]oxymethyl]oxan-2-yl]oxychromen-4-one\n\
CH$COMPOUND_CLASS: Natural Product; Flavonol\n\
CH$FORMULA: C27H30O16\n\
CH$EXACT_MASS: 610.15338\n\
CH$SMILES: C[C@H]1[C@@H]([C@H]([C@H]([C@@H](O1)OC[C@@H]2[C@H]([C@@H]([C@H]([C@@H](O2)OC3=C(OC4=CC(=CC(=C4C3=O)O)O)C5=CC(=C(C=C5)O)O)O)O)O)O)O)O\n\
CH$IUPAC: InChI=1S/C27H30O16/c1-8-17(32)20(35)22(37)26(40-8)39-7-15-18(33)21(36)23(38)27(42-15)43-25-19(34)16-13(31)5-10(28)6-14(16)41-24(25)9-2-3-11(29)12(30)4-9/h2-6,8,15,17-18,20-23,26-33,35-38H,7H2,1H3/t8-,15+,17-,18+,20+,21-,22+,23+,26+,27-/m0/s1\n\
CH$LINK: INCHIKEY IKGXIBQEEMLURG-NVPNHPEKSA-N\n\
CH$LINK: KEGG C05625\n\
CH$LINK: PUBCHEM CID:5280805\n\
CH$LINK: COMPTOX DTXSID3022326\n\
CH$LINK: ChemOnt CHEMONTID:0001111; Organic compounds; Phenylpropanoids and polyketides; Flavonoids; Flavonoid glycosides\n\
AC$INSTRUMENT: API QSTAR Pulsar i\n\
AC$INSTRUMENT_TYPE: LC-ESI-QTOF\n\
AC$MASS_SPECTROMETRY: MS_TYPE MS2\n\
AC$MASS_SPECTROMETRY: ION_MODE POSITIVE\n\
AC$MASS_SPECTROMETRY: COLLISION_ENERGY 10 eV\n\
AC$MASS_SPECTROMETRY: IONIZATION ESI\n\
MS$FOCUSED_ION: PRECURSOR_TYPE [M+H]+\n\
PK$SPLASH: splash10-0wmi-0009506000-98ca7f7c8f3072af4481\n\
PK$NUM_PEAK: 5\n\
PK$PEAK: m/z int. rel.int.\n\
  147.063 121.684 11\n\
  303.050 10000.000 999\n\
  449.108 657.368 64\n\
  465.102 5884.210 587\n\
  611.161 6700.000 669\n\
//\n\
';

function Validation() {
  const { exportServiceUrl } = usePropertiesContext();

  const [rawText, setRawText] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ReactNode | null>(
    null,
  );
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const insertPlaceholder = useCallback((e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setRawText(rawTextPlaceholder);
    setValidationResult('');
  }, []);

  const handleOnDrop = useCallback((files: File[]) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const _rawText = new TextDecoder().decode(buffer);

      setRawText(_rawText);
      setValidationResult('');
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const props: UploadProps = useMemo(() => {
    return {
      name: 'file',
      style: {
        minWidth: 210,
        maxWidth: 210,
        minHeight: 40,
        maxHeight: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      multiple: false,
      showUploadList: false,
      accept: '.txt',
      onDrop: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        handleOnDrop(Array.from(e.dataTransfer.files));
      },
      beforeUpload: async (file: RcFile) => {
        handleOnDrop([file]);

        return false;
      },
    };
  }, [handleOnDrop]);

  const handleOnValidate = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsRequesting(true);

      const result = await validateRecord(exportServiceUrl, rawText);
      if (result.line !== null) {
        result.line = result.line - 1;
      }

      const resultText = `${result.message}${
        result.line !== null && result.line >= 0
          ? ` at line ${result.line + 1}`
          : ''
      }${result.column !== null && result.column >= 0 ? `, column ${result.column + 1}` : ''}`;

      const lines = rawText.split(/\r\n|\r|\n/);
      if (
        result.line !== null &&
        result.line >= 0 &&
        result.line <= lines.length &&
        result.column !== null &&
        result.column >= 0 &&
        result.column <= lines[result.line].length + 1
      ) {
        const preLines = lines.slice(Math.max(0, result.line - 5), result.line);
        const errorLine = lines[result.line];
        const errorLineWithPointer = `${errorLine}\n${' '.repeat(result.column)}^`;
        const postLines = lines.slice(
          result.line + 1,
          Math.min(lines.length, result.line + 6),
        );

        setValidationResult(
          <div
            style={{
              width: '100%',
              height: '100%',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
              }}
            >
              <CloseCircleOutlined
                style={{ color: 'red', fontSize: 25, marginRight: 15 }}
              />
              {resultText}
            </div>
            <br />
            <br />
            {result.line - 6 >= 0 ? (
              <>
                <label>...</label>
                <br />
              </>
            ) : null}
            <label>{preLines.join('\n')}</label>
            <br />
            <label>{errorLineWithPointer}</label>
            <br />
            <label>{postLines.join('\n')}</label>
            {result.line + 6 < lines.length ? (
              <>
                <br />
                <label>...</label>
              </>
            ) : null}
          </div>,
        );
      } else {
        setValidationResult(
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
            }}
          >
            <CheckCircleOutlined
              style={{ color: 'green', fontSize: 25, marginRight: 15 }}
            />
            {resultText}
          </div>,
        );
      }

      setIsRequesting(false);
    },
    [exportServiceUrl, rawText],
  );

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setRawText(e.target.value);
      setValidationResult('');
    },
    [],
  );

  const activeKey = useMemo(() => {
    const keys: string[] = [];
    keys.push('1');
    if (!isRequesting && validationResult !== null) {
      keys.push('2');
    }
    return keys;
  }, [isRequesting, validationResult]);

  const collapse = useMemo(() => {
    const items: CollapseProps['items'] = [
      {
        key: '1',
        label: 'Input MassBank Record Text',
        showArrow: false,
        children: (
          <TextArea
            style={{ width: '100%', height: '100%' }}
            placeholder={rawTextPlaceholder}
            autoSize={{ minRows: 10 }}
            allowClear
            value={rawText}
            onChange={handleOnChange}
          />
        ),
      },
      {
        key: '2',
        label: 'Validation Result',
        showArrow: false,
        children: isRequesting ? (
          <p style={{ color: 'gray' }}>Validating...</p>
        ) : (
          (validationResult ?? <p style={{ color: 'gray' }}>No result</p>)
        ),
      },
    ];

    return (
      <Collapse
        items={items}
        defaultActiveKey={['1']}
        activeKey={activeKey}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }, [activeKey, handleOnChange, isRequesting, rawText, validationResult]);

  return useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Content
          style={{
            width: '100%',
            height: 40,
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <p
            style={{
              fontWeight: 'bold',
              minWidth: 400,
              height: 40,
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Upload or paste your MassBank record file to validate it.
          </p>
          <Content
            style={{
              width: '100%',
              height: 40,
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              marginLeft: 10,
            }}
          >
            <Dragger {...props}>Drag&Drop or click here</Dragger>
            <Button
              style={{
                width: 100,
                height: 40,
                marginLeft: 10,
              }}
              onClick={insertPlaceholder}
            >
              <label>Load Example</label>
            </Button>
          </Content>
        </Content>
        {collapse}
        <Button
          disabled={rawText.trim().length === 0 || isRequesting}
          type="primary"
          style={{ marginTop: 10, marginBottom: 10 }}
          onClick={handleOnValidate}
        >
          {isRequesting ? 'Validating...' : 'Validate'}
        </Button>
      </Content>
    ),
    [
      collapse,
      handleOnValidate,
      insertPlaceholder,
      isRequesting,
      props,
      rawText,
    ],
  );
}

export default Validation;
