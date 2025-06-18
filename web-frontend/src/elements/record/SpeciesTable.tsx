import './Table.scss';

import { CSSProperties, useMemo } from 'react';
import Species from '../../types/record/Species';
import { Table } from 'antd';
import LinksTable from './LinksTable';
import { Content } from 'antd/es/layout/layout';
import ExportableContent from '../common/ExportableContent';
import copyTextToClipboard from '../../utils/copyTextToClipboard';

type InputProps = {
  species: Species | undefined;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function SpeciesTable({ species, width, height }: InputProps) {
  return useMemo(() => {
    const columns = [
      {
        title: 'Parameter',
        dataIndex: 'parameter',
        key: 'parameter',
        align: 'center' as const,
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        align: 'center' as const,
      },
    ];

    const dataSource = [
      {
        key: '1',
        parameter: 'Name',
        value: species?.name ? (
          <ExportableContent
            mode="copy"
            component={species.name}
            title="Copy species name to clipboard"
            onClick={() => copyTextToClipboard('Species Name', species.name)}
          />
        ) : (
          ''
        ),
      },
      {
        key: '2',
        parameter: 'Lineage',
        value: species?.lineage ? (
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
            {species.lineage.map((lineage, index) => (
              <ExportableContent
                key={'record-view-species-lineage-' + index}
                mode="copy"
                component={lineage}
                title={`Copy species lineage ${index + 1} to clipboard`}
                onClick={() =>
                  copyTextToClipboard(`Species Lineage ${index + 1}`, lineage)
                }
              />
            ))}
          </Content>
        ) : (
          ''
        ),
      },
      {
        key: '3',
        parameter: 'Sample',
        value: species?.sample ? (
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
            {species.sample.map((sample, index) => (
              <ExportableContent
                key={'record-view-species-lineage-' + index}
                mode="copy"
                component={sample}
                title={`Copy species sample ${index + 1} to clipboard`}
                onClick={() =>
                  copyTextToClipboard(`Species Sample ${index + 1}`, sample)
                }
              />
            ))}
          </Content>
        ) : (
          ''
        ),
      },
    ];

    return (
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
        <Table
          className="table"
          style={{ width, height: 'auto', marginBottom: 10 }}
          sticky
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />

        {species?.link && species.link.length > 0 && (
          <LinksTable
            links={species.link}
            width={width}
            height="auto"
            title={
              <Content
                style={{
                  width,
                  fontWeight: 'bolder',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                Links
              </Content>
            }
          />
        )}
      </Content>
    );
  }, [height, species, width]);
}

export default SpeciesTable;
