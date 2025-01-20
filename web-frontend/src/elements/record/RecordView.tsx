import Record from '../../types/Record';
import { CSSProperties, useCallback, useMemo } from 'react';
import Resizable from '../common/Resizable';
import { Content } from 'antd/es/layout/layout';
import AnnotationTable from './AnnotationTable';
import { Divider } from 'antd';
import RecordViewHeader from './RecordViewHeader';
import AcquisitionTable from './AcquisitionTable';
import LinksTable from './LinksTable';
import CommentsTable from './CommentsTable';
import SpeciesTable from './SpeciesTable';
import InformationTable from './InformationTable';

type inputProps = {
  record: Record;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function RecordView({ record, width, height }: inputProps) {
  const imageWidth = 500;
  const headerHeight = 400;
  const minChartWidth = useMemo(() => (width as number) / 2, [width]);
  const minPeakTableWith = 400;
  const chartAndPeakTableHeight = 500;

  const buildDivider = useCallback(
    (label: string) => (
      <Divider
        style={{
          color: 'rgb(5, 109, 220)',
          borderColor: 'rgb(5, 109, 220)',
          marginTop: 30,
          marginBottom: 30,
        }}
        orientation="left"
      >
        <label style={{ fontWeight: 'bold' }}>{label}</label>
      </Divider>
    ),
    [],
  );

  return useMemo(() => {
    const hasAnotation =
      record.peak &&
      record.peak.annotation &&
      record.peak.annotation.header &&
      record.peak.annotation.values;

    const hasLinks = record.compound.link && record.compound.link.length > 0;
    const hasSpecies = record.species && Object.keys(record.species).length > 0;
    const hasComments = record.comments && record.comments.length > 0;

    return (
      <Content
        style={{
          width,
          height,
          display: 'block',
          overflow: 'scroll',
          userSelect: 'none',
          backgroundColor: 'white',
        }}
      >
        <RecordViewHeader
          record={record}
          width="100%"
          height={headerHeight}
          imageWidth={imageWidth}
        />
        {buildDivider('Spectrum')}
        <Resizable
          record={record}
          width={width as number}
          height={chartAndPeakTableHeight}
          minChartWidth={minChartWidth}
          minPeakTableWith={minPeakTableWith}
        />
        {hasAnotation && buildDivider('Peak Annotation')}
        {hasAnotation && (
          <AnnotationTable
            annotation={record.peak.annotation}
            width="100%"
            height="auto"
          />
        )}
        {buildDivider('Acquisition')}
        <AcquisitionTable
          acquisition={record.acquisition}
          width="100%"
          height="auto"
        />
        {hasLinks && buildDivider('Links')}
        {hasLinks && (
          <LinksTable links={record.compound.link} width="100%" height="auto" />
        )}
        {hasSpecies && buildDivider('Species')}
        {hasSpecies && (
          <SpeciesTable species={record.species} width="100%" height="auto" />
        )}
        {hasComments && buildDivider('Comments')}
        {hasComments && (
          <CommentsTable
            comments={record.comments}
            width="100%"
            height="auto"
          />
        )}
        {buildDivider('Further Information')}
        <InformationTable record={record} width="100%" height="auto" />
      </Content>
    );
  }, [buildDivider, height, minChartWidth, record, width]);
}

export default RecordView;
