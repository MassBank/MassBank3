import Record from '../../types/Record';
import { CSSProperties, useCallback, useMemo } from 'react';
import Resizable from '../common/Resizable';
import { Content } from 'antd/es/layout/layout';
import AnnotationTable from './AnnotationTable';
import { Divider } from 'antd';
import RecordViewHeader from './RecordViewHeader';
import AcquisitionTable from './AcquisitionTable';
import LinksTable from './LinksTable';

type inputProps = {
  record: Record;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function RecordView({ record, width, height }: inputProps) {
  // const rowSpanSpecies = useMemo(() => {
  //   let count = 1;
  //   if (record.species.name) {
  //     count++;
  //   }
  //   if (record.species.lineage) {
  //     count += record.species.lineage.length;
  //   }
  //   if (record.species.sample) {
  //     count += record.species.sample.length;
  //   }
  //   if (record.species.link) {
  //     count += record.species.link.length;
  //   }

  //   return count;
  // }, [
  //   record.species.lineage,
  //   record.species.link,
  //   record.species.name,
  //   record.species.sample,
  // ]);

  // const recordView = useMemo(
  //   () => (
  //     <div ref={containerRef}>
  //

  //           {/* ########### Species ########### */}
  //           {record.species && Object.keys(record.species).length > 0 && (
  //             <tr>
  //               <td rowSpan={rowSpanSpecies}>Species</td>
  //             </tr>
  //           )}
  //           {record.species && record.species.name && (
  //             <tr>
  //               <td>Name</td>
  //               <td>{record.species.name}</td>
  //             </tr>
  //           )}
  //           {record.species && record.species.lineage && (
  //             <tr>
  //               <td>Lineage</td>
  //               <td>{record.species.lineage.join('; ')}</td>
  //             </tr>
  //           )}
  //           {record.species && record.species.sample && (
  //             <tr>
  //               <td>Sample</td>
  //               <td>{record.species.sample.join('; ')}</td>
  //             </tr>
  //           )}
  //           {record.species && record.species.link && (
  //             <tr>
  //               <td>Link</td>
  //               <td>
  //                 {record.species.link
  //                   .map((link) => link.database + ': ' + link.identifier)
  //                   .join('; ')}
  //               </td>
  //             </tr>
  //           )}
  //           {/* ########### Rest ########### */}
  //           <tr>
  //             <td style={{ borderTop: borderStyle }}>Authors</td>
  //             <td
  //               style={{ borderTop: borderStyle }}
  //               className="long-text"
  //               colSpan={2}
  //             >
  //               {record.authors.map((a) => a.name).join(', ')}
  //             </td>
  //           </tr>
  //           {record.publication && (
  //             <tr>
  //               <td>Publication</td>
  //               <td colSpan={2} className="long-text">
  //                 {record.publication}
  //               </td>
  //             </tr>
  //           )}
  //           {record.copyright && (
  //             <tr>
  //               <td>Copyright</td>
  //               <td colSpan={2}>{record.copyright}</td>
  //             </tr>
  //           )}
  //           {record.license && (
  //             <tr>
  //               <td>License</td>
  //               <td colSpan={2}>{record.license}</td>
  //             </tr>
  //           )}
  //           {record.date && (
  //             <tr>
  //               <td>Date</td>
  //               <td colSpan={2}>{record.date.created}</td>
  //             </tr>
  //           )}
  //           {record.comments && <SubTagTableRows subtags={record.comments} />}
  //         </tbody>
  //       </table>
  //     </div>
  //   ),
  //   [
  //     record,
  //     containerWidth,
  //     containerHeight,
  //     chartAndPeakTableHeight,
  //     chartAndPeakTableContainerWidth,
  //     rowSpanAcquisition,
  //     rowSpanSpecies,
  //   ],
  // );

  const imageWidth = 500;
  const headerHeight = 500;
  const minChartWidth = useMemo(() => (width as number) / 2, [width]);
  const minPeakTableWith = 400;
  const chartAndPeakTableHeight = 500;

  const buildDivider = useCallback(
    (label: string) => (
      <Divider
        style={{
          borderColor: 'black',
        }}
        dashed
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
            height={'auto'}
          />
        )}
        {buildDivider('Acquisition')}
        <AcquisitionTable
          acquisition={record.acquisition}
          width="100%"
          height={'auto'}
        />
        {buildDivider('Links')}
        <LinksTable links={record.compound.link} width="100%" height={'auto'} />
      </Content>
    );
  }, [buildDivider, height, minChartWidth, record, width]);
}

export default RecordView;
