import Record from '../../types/record/Record';
import { JSX, useCallback, useMemo } from 'react';
import Resizable from '../common/Resizable';
import { Content } from 'antd/es/layout/layout';
import AnnotationTable from './AnnotationTable';
import RecordViewHeader from './RecordViewHeader';
import AcquisitionTable from './AcquisitionTable';
import LinksTable from './LinksTable';
import CommentsTable from './CommentsTable';
import SpeciesTable from './SpeciesTable';
import InformationTable from './InformationTable';
import SectionDivider from '../basic/SectionDivider';
import Segmented from '../basic/Segmented';
import segmentedWidth from '../../constants/segmentedWidth';
import MassSpectrometryTable from './MassSpectrometryTable';

type inputProps = {
  record: Record;
  width: number;
  height: number;
};

function RecordView({ record, width, height }: inputProps) {
  const imageWidth = 500;
  const headerHeight = 400;
  const minChartWidth = useMemo(() => width / 2, [width]);
  const minPeakTableWith = 400;
  const chartAndPeakTableHeight = 600;

  const buildDivider = useCallback(
    (label: string) => <SectionDivider label={label} />,
    [],
  );

  return useMemo(() => {
    const hasAnnotation =
      record.peak &&
      record.peak.annotation &&
      record.peak.annotation.header &&
      record.peak.annotation.values;

    const hasLinks = record.compound.link && record.compound.link.length > 0;
    const hasSpecies = record.species && Object.keys(record.species).length > 0;
    const hasComments = record.comments && record.comments.length > 0;

    const elements: JSX.Element[] = [];
    const elementLabels: string[] = [];

    const overview = (
      <RecordViewHeader
        record={record}
        width="100%"
        height={headerHeight}
        imageWidth={imageWidth}
      />
    );
    elements.push(overview);
    elementLabels.push('Overview');

    const spectrum = (
      <Content>
        {buildDivider('Spectrum')}
        <Resizable
          record={record}
          width={width - segmentedWidth}
          height={chartAndPeakTableHeight}
          minChartWidth={minChartWidth}
          minPeakTableWith={minPeakTableWith}
          disableNeutralLossTab
        />
      </Content>
    );
    elements.push(spectrum);
    elementLabels.push('Spectrum');

    const massSpectrometry = (
      <Content>
        {buildDivider('Mass Spectrometry')}
        <MassSpectrometryTable
          massSpectrometry={record.mass_spectrometry}
          width="100%"
          height="auto"
        />
      </Content>
    );
    elements.push(massSpectrometry);
    elementLabels.push('Mass Spectrometry');

    if (hasAnnotation) {
      const peakAnnotation = (
        <Content>
          {buildDivider('Peak Annotation')}
          {
            <AnnotationTable
              annotation={record.peak.annotation}
              width="100%"
              height="auto"
            />
          }
        </Content>
      );
      elements.push(peakAnnotation);
      elementLabels.push('Peak Annotation');
    }

    const acquisition = (
      <Content>
        {buildDivider('Acquisition')}
        <AcquisitionTable
          acquisition={record.acquisition}
          width="100%"
          height="auto"
        />
      </Content>
    );
    elements.push(acquisition);
    elementLabels.push('Acquisition');

    if (hasLinks) {
      const links = (
        <Content>
          {buildDivider('Links')}
          <LinksTable links={record.compound.link} width="100%" height="auto" />
        </Content>
      );
      elements.push(links);
      elementLabels.push('Links');
    }

    if (hasSpecies) {
      const species = (
        <Content>
          {buildDivider('Species')}
          <SpeciesTable species={record.species} width="100%" height="auto" />
        </Content>
      );
      elements.push(species);
      elementLabels.push('Species');
    }

    if (hasComments) {
      const comments = (
        <Content>
          {buildDivider('Comments')}
          <CommentsTable
            comments={record.comments}
            width="100%"
            height="auto"
          />
        </Content>
      );
      elements.push(comments);
      elementLabels.push('Comments');
    }

    const furtherInformation = (
      <Content>
        {buildDivider('Further Information')}
        <InformationTable record={record} width="100%" height="auto" />
      </Content>
    );
    elements.push(furtherInformation);
    elementLabels.push('Further Information');

    return (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          userSelect: 'none',
          backgroundColor: 'white',
        }}
      >
        <Segmented elements={elements} elementLabels={elementLabels} />
      </Content>
    );
  }, [buildDivider, height, minChartWidth, record, width]);
}

export default RecordView;
