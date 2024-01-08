import './RecordView.scss';

import Record from '../../types/Record';
import useContainerDimensions from '../../utils/useContainerDimensions';
import { useCallback, useMemo, useRef, useState } from 'react';
import PeakData from '../../types/PeakData';
import StructureView from '../basic/StructureView';
import Chart from '../basic/Chart';
import PeakTable from './PeakTable';
import { MF } from 'react-mf';

type inputProps = {
  record: Record;
};

function RecordView({ record }: inputProps) {
  console.log(record);

  const containerRef = useRef(null);
  const { height: containerHeight } = useContainerDimensions(containerRef);
  const chartContainerRef = useRef(null);
  const { width: chartContainerWidth } =
    useContainerDimensions(chartContainerRef);

  const chartHeight = useMemo(() => containerHeight * 0.5, [containerHeight]);
  const chartWidth = useMemo(
    () => chartContainerWidth * 0.7,
    [chartContainerWidth],
  );
  const peakTableWidth = useMemo(
    () => chartContainerWidth * 0.3,
    [chartContainerWidth],
  );

  const [filteredPeakData, setFilteredPeakData] = useState<PeakData[]>(
    record.peak.peak.values,
  );

  const handleOnZoom = useCallback((fpd: PeakData[]) => {
    setFilteredPeakData(fpd);
  }, []);

  const recordView = useMemo(
    () => (
      <div className="RecordView" ref={containerRef}>
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
                <div className="structure-view">
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
                <div
                  className="spectrum-peak-table-view"
                  ref={chartContainerRef}
                  style={{ width: '100%', height: chartHeight }}
                >
                  <Chart
                    peakData={record.peak.peak.values}
                    onZoom={handleOnZoom}
                    width={chartWidth}
                    height={chartHeight}
                  />
                  <PeakTable
                    pd={filteredPeakData}
                    width={peakTableWidth}
                    height={chartHeight}
                  />
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
      record.accession,
      record.compound.smiles,
      record.compound.mass,
      record.compound.formula,
      record.compound.names,
      record.compound.classes,
      record.compound.inchi,
      record.title,
      record.date.created,
      record.authors,
      record.license,
      record.peak.peak.values,
      record.peak.splash,
      handleOnZoom,
      chartWidth,
      chartHeight,
      filteredPeakData,
      peakTableWidth,
    ],
  );

  return recordView;
}

export default RecordView;
