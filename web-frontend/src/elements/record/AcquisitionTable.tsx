import './Table.scss';

import { Table } from 'antd';
import Acquisition from '../../types/Acquisition';
import { CSSProperties, useMemo } from 'react';
import { splitStringAndCapitaliseFirstLetter } from '../../utils/stringUtils';
import ExportableContent from '../common/ExportableContent';
import copyTextToClipboard from '../../utils/copyTextToClipboard';

type InputProps = {
  acquisition: Acquisition | undefined;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function AcquisitionTable({ acquisition, width, height }: InputProps) {
  return useMemo(() => {
    if (!acquisition) {
      return null;
    }

    const columns = [
      {
        title: 'Parameter',
        dataIndex: 'Parameter',
        key: 'parameter',
        align: 'center' as const,
      },
      {
        title: 'Value',
        dataIndex: 'Value',
        key: 'value',
        align: 'center' as const,
      },
    ];

    const dataSource: { [key: string]: string | JSX.Element }[] = [];
    dataSource.push({
      Parameter: 'Instrument',
      Value: (
        <ExportableContent
          mode="copy"
          title={'Copy instrument to clipboard'}
          component={acquisition.instrument}
          onClick={() =>
            copyTextToClipboard('Instrument', acquisition.instrument)
          }
        />
      ),
      key: 'key-instrument',
    });
    dataSource.push({
      Parameter: 'Instrument Type',
      Value: (
        <ExportableContent
          mode="copy"
          title={'Copy instrument type to clipboard'}
          component={acquisition.instrument_type}
          onClick={() =>
            copyTextToClipboard('Instrument Type', acquisition.instrument_type)
          }
        />
      ),
      key: 'key-instrument-type',
    });
    dataSource.push({
      Parameter: 'MS Type',
      Value: (
        <ExportableContent
          mode="copy"
          title={'Copy MS type to clipboard'}
          component={acquisition.mass_spectrometry.ms_type}
          onClick={() =>
            copyTextToClipboard(
              'MS Type',
              acquisition.mass_spectrometry.ms_type,
            )
          }
        />
      ),
      key: 'key-ms-type',
    });
    dataSource.push({
      Parameter: 'Ion Mode',
      Value: (
        <ExportableContent
          mode="copy"
          title={'Copy ion mode to clipboard'}
          component={acquisition.mass_spectrometry.ion_mode}
          onClick={() =>
            copyTextToClipboard(
              'Ion Mode',
              acquisition.mass_spectrometry.ion_mode,
            )
          }
        />
      ),
      key: 'key-ion-mode',
    });

    if (acquisition.mass_spectrometry.subtags) {
      acquisition.mass_spectrometry.subtags.forEach((s, i) => {
        const split = splitStringAndCapitaliseFirstLetter(s.subtag, '_', ' ');
        dataSource.push({
          Parameter: split,
          Value: (
            <ExportableContent
              mode="copy"
              title={"Copy '${split}' to clipboard"}
              component={s.value}
              onClick={() => copyTextToClipboard(split, s.value)}
            />
          ),
          key: `key-subtag-${i}`,
        });
      });
    }
    return (
      <Table
        className="table"
        style={{ width, height }}
        sticky
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }, [acquisition, height, width]);
}

export default AcquisitionTable;
