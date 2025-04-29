import { Content } from 'antd/es/layout/layout';
import { CSSProperties, JSX, useMemo } from 'react';
import Metadata from '../../../../types/Metadata';
import { Table } from 'antd';
import ExportableContent from '../../../common/ExportableContent';
import LabelWrapper from '../../../basic/LabelWrapper';
import copyTextToClipboard from '../../../../utils/copyTextToClipboard';
import NotAvailableLabel from '../../../basic/NotAvailableLabel';

const labelWidth = 180;

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

type HeaderTableType = {
  key: string;
  label: string;
  value: JSX.Element;
};

type InputProps = {
  metadata: Metadata | undefined;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
};

function MetadataPanel({ metadata, width = '100%', height }: InputProps) {
  const metadataTable = useMemo(() => {
    if (!metadata) {
      return null;
    }

    const dataSource: HeaderTableType[] = [];
    dataSource.push({
      key: 'metadata-panel-table-commit',
      label: 'Git Commit',
      value: (
        <ExportableContent
          component={<LabelWrapper value={metadata.git_commit} />}
          mode="copy"
          onClick={() => copyTextToClipboard('Git Commit', metadata.git_commit)}
          title="Copy Git Commit to clipboard"
        />
      ),
    });
    dataSource.push({
      key: 'metadata-panel-table-version',
      label: 'Data Version',
      value: (
        <ExportableContent
          component={<LabelWrapper value={metadata.version} />}
          mode="copy"
          onClick={() => copyTextToClipboard('Data Version', metadata.version)}
          title="Copy Data Version to clipboard"
        />
      ),
    });
    dataSource.push({
      key: 'metadata-panel-table-timestamp',
      label: 'Timestamp',
      value: (
        <ExportableContent
          component={<LabelWrapper value={metadata.timestamp} />}
          mode="copy"
          onClick={() => copyTextToClipboard('Timestamp', metadata.timestamp)}
          title="Copy Timestamp to clipboard"
        />
      ),
    });
    dataSource.push({
      key: 'metadata-panel-table-spectra-count',
      label: 'Unique Spectra (SPLASH)',
      value: (
        <ExportableContent
          component={<LabelWrapper value={String(metadata.spectra_count)} />}
          mode="copy"
          onClick={() =>
            copyTextToClipboard(
              'Unique Spectra',
              String(metadata.spectra_count),
            )
          }
          title="Copy Unique Spectra to clipboard"
        />
      ),
    });
    dataSource.push({
      key: 'metadata-panel-table-compound-count',
      label: 'Unique Compounds (InChI)',
      value: (
        <ExportableContent
          component={<LabelWrapper value={String(metadata.compound_count)} />}
          mode="copy"
          onClick={() =>
            copyTextToClipboard(
              'Unique Compounds',
              String(metadata.compound_count),
            )
          }
          title="Copy Unique Compound to clipboard"
        />
      ),
    });
    dataSource.push({
      key: 'metadata-panel-table-compound-class-count-chemont',
      label: 'Compound Classes (ChemOnt)',
      value:
        metadata.compound_class_chemont &&
        metadata.compound_class_chemont.length > 0 ? (
          <ExportableContent
            component={
              <LabelWrapper
                value={String(metadata.compound_class_chemont.length)}
              />
            }
            mode="copy"
            onClick={() =>
              copyTextToClipboard(
                'Compound class count (ChemOnt)',
                String(metadata.compound_class_chemont.length),
              )
            }
            title="Copy compound class count to clipboard"
          />
        ) : (
          <NotAvailableLabel />
        ),
    });
    dataSource.push({
      key: 'metadata-panel-table-compound-class-count',
      label: 'Compound classes (free text)',
      value: (
        <ExportableContent
          component={
            <LabelWrapper value={String(metadata.compound_class.length)} />
          }
          mode="copy"
          onClick={() =>
            copyTextToClipboard(
              'Compound class count (free text)',
              String(metadata.compound_class.length),
            )
          }
          title="Copy compound class count to clipboard"
        />
      ),
    });

    return (
      <Table<HeaderTableType>
        style={{
          width,
          height: '100%',
        }}
        className="table"
        sticky
        pagination={false}
        showHeader={false}
        columns={columns}
        dataSource={dataSource}
      />
    );
  }, [metadata, width]);

  return useMemo(
    () => (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {metadataTable}
      </Content>
    ),
    [height, metadataTable, width],
  );
}

export default MetadataPanel;
