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
import { splitStringAndCapitaliseFirstLetter } from '../../utils/stringUtils';

type inputProps = {
  record: Record;
};

function RecordView({ record }: inputProps) {
  useEffect(() => {
    console.log(record);
  }, [record]);

  const containerRef = useRef(null);
  const { width: containerWidth, height: containerHeight } =
    useContainerDimensions(containerRef);
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
              <td rowSpan={6} style={{ width: '100%' }}>
                <div className="structure-view">
                  {record.compound.smiles &&
                  record.compound.smiles !== '' &&
                  containerWidth > 0 ? (
                    <StructureView
                      smiles={record.compound.smiles}
                      imageWidth={containerWidth * 0.4}
                      imageHeight={containerHeight / 3}
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
              <td>Mass</td>
              <td>{record.compound.mass}</td>
            </tr>
            <tr>
              <td>Formula</td>
              <td>
                <MF mf={record.compound.formula} />{' '}
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
              <td>SPLASH</td>
              <td colSpan={2}>{record.peak.splash}</td>
            </tr>
            <tr>
              <td>InChI</td>
              <td colSpan={2} className="long-text">
                {record.compound.inchi}
              </td>
            </tr>
            <tr>
              <td style={{ borderBottom: '1px solid grey' }}>SMILES</td>
              <td
                colSpan={2}
                className="long-text"
                style={{ borderBottom: '1px solid grey' }}
              >
                {record.compound.smiles}
              </td>
            </tr>
            <tr>
              <td>Instrument</td>
              <td colSpan={2} className="long-text">
                {record.acquisition.instrument}
              </td>
            </tr>
            <tr>
              <td
                style={
                  !record.acquisition.chromatography ||
                  record.acquisition.chromatography.length === 0
                    ? { borderBottom: '1px solid grey' }
                    : undefined
                }
              >
                Instrument Type
              </td>
              <td
                colSpan={2}
                className="long-text"
                style={
                  !record.acquisition.chromatography ||
                  record.acquisition.chromatography.length === 0
                    ? { borderBottom: '1px solid grey' }
                    : undefined
                }
              >
                {record.acquisition.instrument_type}
              </td>
            </tr>
            {record.acquisition &&
              record.acquisition.chromatography &&
              record.acquisition.chromatography.map((subtag, i) => {
                return (
                  <tr key={'acqu-chrom-' + subtag.subtag + '-' + subtag.value}>
                    <td
                      style={
                        i === record.acquisition.chromatography.length - 1
                          ? { borderBottom: '1px solid grey' }
                          : undefined
                      }
                    >
                      {splitStringAndCapitaliseFirstLetter(
                        subtag.subtag,
                        '_',
                        ' ',
                      )}
                    </td>
                    <td
                      colSpan={2}
                      className="long-text"
                      style={
                        i === record.acquisition.chromatography.length - 1
                          ? { borderBottom: '1px solid grey' }
                          : undefined
                      }
                    >
                      {subtag.value}
                    </td>
                  </tr>
                );
              })}
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
              <td>Copyright</td>
              <td colSpan={2}>{record.copyright}</td>
            </tr>
            <tr>
              <td>License</td>
              <td colSpan={2}>{record.license}</td>
            </tr>
            <tr>
              <td>Date</td>
              <td colSpan={2}>{record.date.created}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    [
      record.accession,
      record.compound.smiles,
      record.compound.formula,
      record.compound.mass,
      record.compound.names,
      record.compound.classes,
      record.compound.inchi,
      record.title,
      record.authors,
      record.publication,
      record.peak.peak.values,
      record.peak.splash,
      record.peak.annotation,
      record.acquisition,
      record.copyright,
      record.license,
      record.date.created,
      containerWidth,
      containerHeight,
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
