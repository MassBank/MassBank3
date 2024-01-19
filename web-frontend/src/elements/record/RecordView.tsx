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
import getLinkedAnnotations from '../../utils/getLinkedAnnotations';
import LinkedPeakAnnotation from '../../types/peak/LinkedPeakAnnotation';
import SubTagTableRows from './SubTagTableRows';

const borderStyle = '2px solid grey';

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

  const linkedAnnotations = useMemo(
    () => getLinkedAnnotations(record.peak.peak.values, record.peak.annotation),
    [record.peak],
  );

  const [filteredLinkedAnnotations, setFilteredLinkedAnnotations] =
    useState<LinkedPeakAnnotation[]>(linkedAnnotations);

  const handleOnZoom = useCallback(
    (fpd: Peak[]) => {
      setFilteredPeakData(fpd);

      const _filteredLinkedAnnotations = getLinkedAnnotations(
        fpd,
        record.peak.annotation,
      );
      setFilteredLinkedAnnotations(_filteredLinkedAnnotations);
    },
    [record.peak.annotation],
  );

  const rowSpanAcquisition = useMemo(() => {
    let count = 1;
    if (record.acquisition.instrument) {
      count++;
    }
    if (record.acquisition.instrument_type) {
      count++;
    }
    if (record.acquisition.mass_spectrometry.ms_type) {
      count++;
    }
    if (record.acquisition.mass_spectrometry.ion_mode) {
      count++;
    }
    if (record.acquisition.mass_spectrometry.subtags) {
      count += record.acquisition.mass_spectrometry.subtags.length;
    }
    if (record.acquisition.chromatography) {
      count += record.acquisition.chromatography.length;
    }

    return count;
  }, [
    record.acquisition.chromatography,
    record.acquisition.instrument,
    record.acquisition.instrument_type,
    record.acquisition.mass_spectrometry.ion_mode,
    record.acquisition.mass_spectrometry.ms_type,
    record.acquisition.mass_spectrometry.subtags,
  ]);

  const rowSpanSpecies = useMemo(() => {
    let count = 1;
    if (record.species.name) {
      count++;
    }
    if (record.species.lineage) {
      count += record.species.lineage.length;
    }
    if (record.species.sample) {
      count += record.species.sample.length;
    }
    if (record.species.link) {
      count += record.species.link.length;
    }

    return count;
  }, [
    record.species.lineage,
    record.species.link,
    record.species.name,
    record.species.sample,
  ]);

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
                    peaks={filteredPeakData}
                    annotations={record.peak.annotation}
                    linkedAnnotations={filteredLinkedAnnotations}
                    width={peakTableWidth}
                    height={chartHeight}
                  />
                </div>
              </td>
            </tr>
            {record.peak.annotation &&
              Object.keys(record.peak.annotation).length > 0 && (
                <tr>
                  <td>Annotation</td>
                  <td colSpan={2}>
                    {
                      <AnnotationTable
                        annotation={record.peak.annotation}
                        width="100%"
                        height={300}
                      />
                    }
                  </td>
                </tr>
              )}
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
              <td style={{ borderBottom: borderStyle }}>SMILES</td>
              <td
                colSpan={2}
                className="long-text"
                style={{ borderBottom: borderStyle }}
              >
                {record.compound.smiles}
              </td>
            </tr>
            {record.compound.link && (
              <tr>
                <td rowSpan={record.compound.link.length + 1}>Links</td>
              </tr>
            )}
            {/* ########### Links ########### */}
            {record.compound.link &&
              record.compound.link.map((link) => (
                <tr key={'link-' + link.database + '-' + link.identifier}>
                  <td>{link.database}</td>
                  <td>{link.identifier}</td>
                </tr>
              ))}
            {/* ########### Acquisition ########### */}
            <tr>
              <td
                rowSpan={rowSpanAcquisition}
                style={{ borderTop: borderStyle }}
              >
                Acquisition
              </td>
            </tr>
            <tr>
              <td style={{ borderTop: borderStyle }}>Instrument</td>
              <td className="long-text" style={{ borderTop: borderStyle }}>
                {record.acquisition.instrument}
              </td>
            </tr>
            <tr>
              <td>Instrument Type</td>
              <td className="long-text">
                {record.acquisition.instrument_type}
              </td>
            </tr>
            <tr>
              <td>MS Type</td>
              <td className="long-text">
                {record.acquisition.mass_spectrometry.ms_type}
              </td>
            </tr>
            <tr>
              <td>Ion Mode</td>
              <td className="long-text">
                {record.acquisition.mass_spectrometry.ion_mode}
              </td>
            </tr>
            {record.acquisition && record.acquisition.mass_spectrometry && (
              <SubTagTableRows
                subtags={record.acquisition.mass_spectrometry.subtags}
              />
            )}
            {record.acquisition && record.acquisition.chromatography && (
              <SubTagTableRows subtags={record.acquisition.chromatography} />
            )}
            {/* ########### Species ########### */}
            {record.species && Object.keys(record.species).length > 0 && (
              <tr>
                <td rowSpan={rowSpanSpecies}>Species</td>
              </tr>
            )}
            {record.species && record.species.name && (
              <tr>
                <td>Name</td>
                <td>{record.species.name}</td>
              </tr>
            )}
            {record.species && record.species.lineage && (
              <tr>
                <td>Lineage</td>
                <td>{record.species.lineage.join('; ')}</td>
              </tr>
            )}
            {record.species && record.species.sample && (
              <tr>
                <td>Sample</td>
                <td>{record.species.sample.join('; ')}</td>
              </tr>
            )}
            {record.species && record.species.link && (
              <tr>
                <td>Link</td>
                <td>
                  {record.species.link
                    .map((link) => link.database + ': ' + link.identifier)
                    .join('; ')}
                </td>
              </tr>
            )}
            {/* ########### Rest ########### */}
            <tr>
              <td style={{ borderTop: borderStyle }}>Authors</td>
              <td
                style={{ borderTop: borderStyle }}
                className="long-text"
                colSpan={2}
              >
                {record.authors.map((a) => a.name).join(', ')}
              </td>
            </tr>
            {record.publication && (
              <tr>
                <td>Publication</td>
                <td colSpan={2} className="long-text">
                  {record.publication}
                </td>
              </tr>
            )}
            {record.copyright && (
              <tr>
                <td>Copyright</td>
                <td colSpan={2}>{record.copyright}</td>
              </tr>
            )}
            {record.license && (
              <tr>
                <td>License</td>
                <td colSpan={2}>{record.license}</td>
              </tr>
            )}
            {record.date && (
              <tr>
                <td>Date</td>
                <td colSpan={2}>{record.date.created}</td>
              </tr>
            )}
            {record.comments && <SubTagTableRows subtags={record.comments} />}
          </tbody>
        </table>
      </div>
    ),
    [
      record.accession,
      record.compound.smiles,
      record.compound.names,
      record.compound.classes,
      record.compound.mass,
      record.compound.formula,
      record.compound.inchi,
      record.compound.link,
      record.title,
      record.peak.peak.values,
      record.peak.annotation,
      record.peak.splash,
      record.acquisition,
      record.species,
      record.authors,
      record.publication,
      record.copyright,
      record.license,
      record.date,
      record.comments,
      containerWidth,
      containerHeight,
      chartHeight,
      handleOnZoom,
      chartWidth,
      filteredPeakData,
      filteredLinkedAnnotations,
      peakTableWidth,
      rowSpanAcquisition,
      rowSpanSpecies,
    ],
  );

  return recordView;
}

export default RecordView;
