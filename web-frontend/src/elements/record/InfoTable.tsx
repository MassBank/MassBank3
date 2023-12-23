import './InfoTable.scss';

import StructureView from '../basic/StructureView';
import { MF } from 'react-mf';
import { useMemo } from 'react';
import Chart from '../basic/Chart';
import PeakTable from './PeakTable';
import Record from '../../types/Record';

type InputProps = {
  record: Record;
  className?: string;
};

function InfoTable({ record, className = 'InfoTable' }: InputProps) {
  console.log(record);

  const infoTable = useMemo(
    () => (
      <div className={className}>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accession</td>
              <td>{record.accession}</td>
            </tr>
            <tr>
              <td>Title</td>
              <td>{record.title}</td>
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
              <td style={{ borderBottom: '1px solid grey' }}>
                {record.license}
              </td>
            </tr>
            <tr>
              <td>
                <span>Structure /</span>
                <br />
                <span>Spectrum</span>
              </td>
              <td>
                <div className="structure-spectrum-view">
                  {record.compound.smiles && record.compound.smiles !== '' ? (
                    <StructureView
                      smiles={record.compound.smiles}
                      imageWidth={400}
                      imageHeight={400}
                    />
                  ) : undefined}
                  <Chart
                    peakData={record.peak.peak.values}
                    width={600}
                    height={400}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>Peaks</td>
              <td>
                <PeakTable pd={record.peak.peak.values} />
              </td>
            </tr>
            <tr>
              <td>Mass</td>
              <td>{record.compound.mass}</td>
            </tr>
            <tr>
              <td>SPLASH</td>
              <td>{record.peak.splash}</td>
            </tr>
            <tr>
              <td>Formula</td>
              <td>
                <MF mf={record.compound.formula} />{' '}
              </td>
            </tr>
            <tr>
              <td>Names</td>
              <td>{record.compound.names}</td>
            </tr>
            <tr>
              <td>Classes</td>
              <td>{record.compound.classes}</td>
            </tr>
            <tr>
              <td>InChI</td>
              <td>{record.compound.inchi}</td>
            </tr>
            <tr>
              <td style={{ borderBottom: '1px solid grey' }}>SMILES</td>
              <td style={{ borderBottom: '1px solid grey' }}>
                {record.compound.smiles}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    [
      className,
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
