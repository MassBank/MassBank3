import './InfoTable.scss';

import StructureView from '../basic/StructureView';
import { MF } from 'react-mf';
import { useCallback, useMemo, useState } from 'react';
import Chart from '../basic/Chart';
import PeakTable from './PeakTable';
import Record from '../../types/Record';
import PeakData from '../../types/PeakData';

type InputProps = {
  record: Record;
  className?: string;
};

function InfoTable({ record, className = 'InfoTable' }: InputProps) {
  console.log(record);

  const [filteredPeakData, setFilteredPeakData] = useState<PeakData[]>(
    record.peak.peak.values,
  );

  const handleOnZoom = useCallback((fpd: PeakData[]) => {
    setFilteredPeakData(fpd);
  }, []);

  const infoTable = useMemo(
    () => (
      <div className={className}>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th colSpan={2}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accession</td>
              <td>{record.accession}</td>
              <td
                style={{
                  borderBottom: '1px solid grey',
                  width: '100%',
                  height: '100%',
                }}
                rowSpan={5}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {record.compound.smiles && record.compound.smiles !== '' ? (
                    <StructureView
                      smiles={record.compound.smiles}
                      imageWidth={400}
                      imageHeight={400}
                    />
                  ) : undefined}
                </div>
              </td>
            </tr>
            <tr>
              <td>Title</td>
              <td>
                {record.title.split(';').map((r) => {
                  return (
                    <span key={r}>
                      <label>{r}</label>
                      <br />
                    </span>
                  );
                })}
              </td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{record.date.created}</td>
            </tr>
            <tr>
              <td>Authors</td>
              <td>{record.authors.map((a) => a.name).join(', ')}</td>
            </tr>
            <tr>
              <td style={{ borderBottom: '1px solid grey' }}>License</td>
              <td style={{ borderBottom: '1px solid grey', width: '100%' }}>
                {record.license}
              </td>
            </tr>
            <tr>
              <td>Spectrum</td>
              <td colSpan={2}>
                <div className="structure-spectrum-view">
                  <Chart
                    peakData={record.peak.peak.values}
                    onZoom={handleOnZoom}
                    width={700}
                    height={400}
                  />
                  <PeakTable pd={filteredPeakData} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Mass</td>
              <td colSpan={2}>{record.compound.mass}</td>
            </tr>
            <tr>
              <td>SPLASH</td>
              <td colSpan={2}>{record.peak.splash}</td>
            </tr>
            <tr>
              <td>Formula</td>
              <td colSpan={2}>
                <MF mf={record.compound.formula} />{' '}
              </td>
            </tr>
            <tr>
              <td>Names</td>
              <td colSpan={2}>{record.compound.names}</td>
            </tr>
            <tr>
              <td>Classes</td>
              <td colSpan={2}>{record.compound.classes}</td>
            </tr>
            <tr>
              <td>InChI</td>
              <td colSpan={2}>{record.compound.inchi}</td>
            </tr>
            <tr>
              <td style={{ borderBottom: '1px solid grey' }}>SMILES</td>
              <td style={{ borderBottom: '1px solid grey' }} colSpan={2}>
                {record.compound.smiles}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    [
      className,
      filteredPeakData,
      handleOnZoom,
      record.accession,
      record.authors,
      record.compound.classes,
      record.compound.formula,
      record.compound.inchi,
      record.compound.mass,
      record.compound.names,
      record.compound.smiles,
      record.date.created,
      record.license,
      record.peak.peak.values,
      record.peak.splash,
      record.title,
    ],
  );

  return infoTable;
}

export default InfoTable;
