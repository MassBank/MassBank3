import './RecordView.scss';

import Record from '../../types/Record';
import useContainerDimensions from '../../utils/useContainerDimensions';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import StructureView from '../basic/StructureView';
import Chart from '../basic/Chart';
import PeakTable from './PeakTable';
import { MF } from 'react-mf';
import Peak from '../../types/peak/Peak';
import AnnotationTable from './AnnotationTable';

type inputProps = {
  record: Record;
};

function RecordView({ record }: inputProps) {
  useEffect(() => {
    console.log(record);
  }, [record]);

  const containerRef = useRef(null);
  const { height: containerHeight } = useContainerDimensions(containerRef);
  const chartContainerRef = useRef(null);
  const { width: chartContainerWidth } =
    useContainerDimensions(chartContainerRef);

  const chartHeight = useMemo(() => containerHeight * 0.6, [containerHeight]);
  const chartWidth = useMemo(
    () => chartContainerWidth * 0.7,
    [chartContainerWidth],
  );
  const peakTableWidth = useMemo(
    () => chartContainerWidth * 0.3,
    [chartContainerWidth],
  );

  const [filteredPeakData, setFilteredPeakData] = useState<Peak[]>(
    record.peak.peak.values,
  );

  const handleOnZoom = useCallback((fpd: Peak[]) => {
    setFilteredPeakData(fpd);
  }, []);

  const recordView = useMemo(
    () => (
      <div className="RecordView" ref={containerRef}>
        <table>
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
                rowSpan={6}
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
              <td className="long-text">{record.title}</td>
            </tr>
            <tr>
              <td>Names</td>
              <td className="long-text">{record.compound.names.join('; ')}</td>
            </tr>
            <tr>
              <td>Classes</td>
              <td className="long-text">
                {record.compound.classes.join('; ')}
              </td>
            </tr>
            <tr>
              <td>InChI</td>
              <td className="long-text">{record.compound.inchi}</td>
            </tr>
            <tr>
              <td>SMILES</td>
              <td>{record.compound.smiles}</td>
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
              <td>SPLASH</td>
              <td colSpan={2}>{record.peak.splash}</td>
            </tr>
            <tr>
              <td>Mass</td>
              <td colSpan={2}>{record.compound.mass}</td>
            </tr>
            <tr>
              <td>Formula</td>
              <td colSpan={2}>
                <MF mf={record.compound.formula} />{' '}
              </td>
            </tr>
            <tr>
              <td>Annotation</td>
              <td colSpan={2}>
                {record.peak.annotation &&
                  Object.keys(record.peak.annotation).length > 0 && (
                    <AnnotationTable
                      annotation={record.peak.annotation}
                      width="100%"
                      height={300}
                    />
                  )}
              </td>
            </tr>
            <tr>
              <td>Date</td>
              <td colSpan={2}>{record.date.created}</td>
            </tr>
            <tr>
              <td>Authors</td>
              <td colSpan={2} className="long-text">
                {record.authors.map((a) => a.name).join(', ')}
              </td>
            </tr>
            <tr>
              <td>Publication</td>
              <td colSpan={2} className="long-text">
                {record.publication}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  wordBreak: 'break-all',
                  whiteSpace: 'pre-wrap',
                }}
              >
                Copyright/License
              </td>
              <td colSpan={2} style={{ width: '100%' }}>
                {record.copyright + ' / ' + record.license}
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
      record.publication,
      record.copyright,
      record.license,
      record.peak.peak.values,
      record.peak.splash,
      record.peak.annotation,
      chartHeight,
      handleOnZoom,
      chartWidth,
      filteredPeakData,
      peakTableWidth,
    ],
  );

  return recordView;
}

export default RecordView;
