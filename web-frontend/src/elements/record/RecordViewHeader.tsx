import './RecordViewHeader.scss';

import { Content } from 'antd/es/layout/layout';
import ExportableContent from '../common/ExportableContent';
import { CSSProperties, useCallback, useMemo } from 'react';
import copyTextToClipboard from '../../utils/copyTextToClipboard';
import routes from '../../constants/routes';
import { Table } from 'antd';
import Record from '../../types/Record';
import { MF } from 'react-mf';
import StructureView from '../basic/StructureView';

const titleHeight = 50;
const labelWidth = 120;

type HeaderTableType = {
  key: string;
  label: string;
  value: JSX.Element;
  copyButton?: JSX.Element;
};
const columns = [
  {
    dataIndex: 'label',
    key: 'record-view-header-table-label',
    width: labelWidth,
    align: 'left' as const,
  },
  {
    dataIndex: 'value',
    key: 'record-view-header-table-value',
    width: `calc(100% - ${labelWidth})`,
    align: 'left' as const,
  },
];

type InputProps = {
  record: Record;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  imageWidth: CSSProperties['width'];
};

function RecordViewHeader({ record, width, height, imageWidth }: InputProps) {
  const handleOnCopy = useCallback((label: string, text: string) => {
    copyTextToClipboard(label, text);
  }, []);

  const buildSearchUrl = useCallback((label: string, value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(label, value);
    const url =
      import.meta.env.VITE_MB3_FRONTEND_URL +
      routes.search.path +
      `?${searchParams.toString()}`;

    return url;
  }, []);

  return useMemo(() => {
    const dataSource: HeaderTableType[] = [];
    dataSource.push({
      key: 'record-view-header-table-names',
      label: 'Names',
      value: (
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'left',
          }}
        >
          {record.compound.names.map((name, i) => (
            <ExportableContent
              key={'name-label-' + name}
              component={name}
              componentStyle={{ justifyContent: 'left' }}
              mode="copy"
              onClick={() => handleOnCopy(`${i + 1}. compound name:`, name)}
              width="100%"
              height="100%"
              title="Copy compound name to clipboard"
              enableSearch
              searchTitle="Search for compound name"
              searchUrl={buildSearchUrl('compound_name', name)}
            />
          ))}
        </Content>
      ),
    });
    dataSource.push({
      key: 'record-view-header-table-classes',
      label: 'Classes',
      value:
        record.compound.classes &&
        record.compound.classes.length === 1 &&
        record.compound.classes[0] !== 'N/A' ? (
          <ExportableContent
            component={record.compound.classes[0]}
            componentStyle={{ justifyContent: 'left' }}
            mode="copy"
            onClick={() =>
              handleOnCopy('Compound classes', record.compound.classes[0])
            }
            width="100%"
            height="100%"
            title="Copy compound classes to clipboard"
          />
        ) : (
          <label style={{ color: 'grey', fontStyle: 'italic' }}>N/A</label>
        ),
    });
    dataSource.push({
      key: 'record-view-header-table-authors',
      label: 'Authors',
      value: (
        <ExportableContent
          component={record.authors.map((a) => a.name).join(', ')}
          componentStyle={{ justifyContent: 'left' }}
          mode="copy"
          onClick={() =>
            handleOnCopy(
              'Authors',
              record.authors.map((a) => a.name).join(', '),
            )
          }
          width="100%"
          height="100%"
          title="Copy authors to clipboard"
        />
      ),
    });
    dataSource.push({
      key: 'record-view-header-table-publication',
      label: 'Publication',
      value:
        record.publication && record.publication !== '' ? (
          <ExportableContent
            component={record.publication}
            componentStyle={{ justifyContent: 'left' }}
            mode="copy"
            onClick={() => handleOnCopy('Publication', record.publication)}
            width="100%"
            height="100%"
            title="Copy publication to clipboard"
          />
        ) : (
          <label style={{ color: 'grey', fontStyle: 'italic' }}>N/A</label>
        ),
    });
    dataSource.push({
      key: 'record-view-header-table-smiles',
      label: 'SMILES',
      value: (
        <ExportableContent
          component={record.compound.smiles}
          componentStyle={{ justifyContent: 'left' }}
          mode="copy"
          onClick={() => handleOnCopy('SMILES', record.compound.smiles)}
          width="100%"
          height="100%"
          title="Copy SMILES to clipboard"
          enableSearch
          searchTitle="Search for SMILES"
          searchUrl={buildSearchUrl('substructure', record.compound.smiles)}
        />
      ),
    });
    dataSource.push({
      key: 'record-view-header-table-inchi',
      label: 'InChI',
      value: (
        <ExportableContent
          component={record.compound.inchi}
          componentStyle={{ justifyContent: 'left' }}
          mode="copy"
          onClick={() => handleOnCopy('InChI', record.compound.inchi)}
          width="100%"
          height="100%"
          title="Copy InChi to clipboard"
          enableSearch
          searchTitle="Search for InChI"
          searchUrl={buildSearchUrl('inchi', record.compound.inchi)}
        />
      ),
    });
    dataSource.push({
      key: 'record-view-header-table-splash',
      label: 'SPLASH',
      value: (
        <ExportableContent
          component={record.peak.splash}
          componentStyle={{ justifyContent: 'left' }}
          mode="copy"
          onClick={() => handleOnCopy('SPLASH', record.peak.splash)}
          width="100%"
          height="100%"
          title="Copy SPLASH to clipboard"
          enableSearch
          searchTitle="Search for SPLASH"
          searchUrl={buildSearchUrl('splash', record.peak.splash)}
        />
      ),
    });

    return (
      <Content
        style={{
          width,
          minHeight: height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <ExportableContent
          component={record.title}
          componentStyle={{
            minHeight: titleHeight,
            maxHeight: titleHeight,
            fontSize: 18,
            fontWeight: 'bold',
            padding: 10,
          }}
          mode="copy"
          onClick={() => handleOnCopy('Title', record.title)}
          width="100%"
          height="100%"
          title="Copy title to clipboard"
          buttonStyle={{
            fontSize: undefined,
          }}
        />
        <Content
          style={{
            width: '100%',
            minHeight: `calc(${height} - ${titleHeight})`,
            maxHeight: `calc(${height} - ${titleHeight})`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Table<HeaderTableType>
            style={{
              minWidth: `calc(100% - ${imageWidth})`,
              maxWidth: `calc(100% - ${imageWidth})`,
              height: '100%',
            }}
            className="record-view-header-table"
            sticky
            pagination={false}
            showHeader={false}
            columns={columns}
            dataSource={dataSource}
          />
          <Content
            style={{
              minWidth: imageWidth,
              maxWidth: imageWidth,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {record.compound.smiles && record.compound.smiles !== '' ? (
              <StructureView
                smiles={record.compound.smiles}
                imageWidth={imageWidth as number}
                imageHeight={(height as number) - titleHeight - 80}
              />
            ) : undefined}

            <Content
              style={{
                width: imageWidth,
                height: `calc(100% - ${height} - ${titleHeight} - 80px)`,
                display: 'grid',
                gridTemplateColumns: '65px auto 95px auto',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}
            >
              <label>Formula: </label>
              <ExportableContent
                component={<MF mf={record.compound.formula} />}
                componentStyle={{ fontWeight: 'bolder', marginRight: 20 }}
                mode="copy"
                onClick={() =>
                  copyTextToClipboard(
                    'Molecular Formula',
                    record.compound.formula,
                  )
                }
                width="100%"
                height="100%"
                title="Copy molecular formula to clipboard"
                enableSearch
                searchTitle="Search for molecular formula"
                searchUrl={buildSearchUrl('formula', record.compound.formula)}
              />
              <label style={{ marginLeft: 50 }}>Mass: </label>
              <ExportableContent
                component={record.compound.mass.toString()}
                componentStyle={{ fontWeight: 'bolder', marginRight: 20 }}
                mode="copy"
                onClick={() =>
                  copyTextToClipboard(
                    'Molecular Mass',
                    record.compound.mass.toString(),
                  )
                }
                width="100%"
                height="100%"
                title="Copy molecular mass to clipboard"
                enableSearch
                searchTitle="Search for molecular mass"
                searchUrl={buildSearchUrl(
                  'exact_mass',
                  record.compound.mass.toString(),
                )}
              />
            </Content>
          </Content>
        </Content>
      </Content>
    );
  }, [
    buildSearchUrl,
    handleOnCopy,
    height,
    imageWidth,
    record.authors,
    record.compound.classes,
    record.compound.formula,
    record.compound.inchi,
    record.compound.mass,
    record.compound.names,
    record.compound.smiles,
    record.peak.splash,
    record.publication,
    record.title,
    width,
  ]);
}

export default RecordViewHeader;
