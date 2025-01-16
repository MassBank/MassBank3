import './RecordView.scss';

import Record from '../../types/Record';
import { CSSProperties, useCallback, useMemo } from 'react';
import StructureView from '../basic/StructureView';
import Resizable from '../common/Resizable';
import { Content } from 'antd/es/layout/layout';
import { MF } from 'react-mf';
import AnnotationTable from './AnnotationTable';
import { Table } from 'antd';
import copyTextToClipboard from '../../utils/copyTextToClipboard';
import ExportableContent from '../common/ExportableContent';
import routes from '../../constants/routes';

type inputProps = {
  record: Record;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function RecordView({ record, width, height }: inputProps) {
  // const chartAndPeakTableContainerRef = useRef(null);
  // const { width: chartAndPeakTableContainerWidth } = useContainerDimensions(
  //   chartAndPeakTableContainerRef,
  // );

  // const chartAndPeakTableHeight = useMemo(
  //   () => containerHeight * 0.6,
  //   [containerHeight],
  // );

  // const rowSpanAcquisition = useMemo(() => {
  //   let count = 1;
  //   if (record.acquisition.instrument) {
  //     count++;
  //   }
  //   if (record.acquisition.instrument_type) {
  //     count++;
  //   }
  //   if (record.acquisition.mass_spectrometry.ms_type) {
  //     count++;
  //   }
  //   if (record.acquisition.mass_spectrometry.ion_mode) {
  //     count++;
  //   }
  //   if (record.acquisition.mass_spectrometry.subtags) {
  //     count += record.acquisition.mass_spectrometry.subtags.length;
  //   }
  //   if (record.acquisition.chromatography) {
  //     count += record.acquisition.chromatography.length;
  //   }

  //   return count;
  // }, [
  //   record.acquisition.chromatography,
  //   record.acquisition.instrument,
  //   record.acquisition.instrument_type,
  //   record.acquisition.mass_spectrometry.ion_mode,
  //   record.acquisition.mass_spectrometry.ms_type,
  //   record.acquisition.mass_spectrometry.subtags,
  // ]);

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
  //       <table>
  //         <tbody>
  //           <tr>
  //             <td>Accession</td>
  //             <td>{record.accession}</td>
  //             <td rowSpan={6} style={{ width: '100%' }}>
  //               <div className="structure-view">
  //                 {record.compound.smiles &&
  //                 record.compound.smiles !== '' &&
  //                 containerWidth > 0 ? (
  //                   <StructureView
  //                     smiles={record.compound.smiles}
  //                     imageWidth={containerWidth * 0.4}
  //                     imageHeight={containerHeight / 3}
  //                   />
  //                 ) : undefined}
  //               </div>
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>Title</td>
  //             <td className="long-text">{record.title}</td>
  //           </tr>
  //           <tr>
  //             <td>Names</td>
  //             <td className="long-text">{record.compound.names.join('; ')}</td>
  //           </tr>
  //           <tr>
  //             <td>Classes</td>
  //             <td className="long-text">
  //               {record.compound.classes.join('; ')}
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>Mass</td>
  //             <td>{record.compound.mass}</td>
  //           </tr>
  //           <tr>
  //             <td>Formula</td>
  //             <td>
  //               <p>{record.compound.formula} </p>
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>Spectrum</td>
  //             <td colSpan={2}>
  //               <div
  //                 className="spectrum-peak-table-view"
  //                 ref={chartAndPeakTableContainerRef}
  //                 style={{ width: '100%', height: chartAndPeakTableHeight }}
  //               >
  //                 <Resizable
  //                   record={record}
  //                   width={chartAndPeakTableContainerWidth}
  //                   height={chartAndPeakTableHeight}
  //                 />
  //               </div>
  //             </td>
  //           </tr>
  //           {record.peak.annotation &&
  //             Object.keys(record.peak.annotation).length > 0 && (
  //               <tr>
  //                 <td>Annotation</td>
  //                 <td colSpan={2}>
  //                   {
  //                     <AnnotationTable
  //                       annotation={record.peak.annotation}
  //                       width="100%"
  //                       height={300}
  //                     />
  //                   }
  //                 </td>
  //               </tr>
  //             )}
  //           <tr>
  //             <td>SPLASH</td>
  //             <td colSpan={2}>{record.peak.splash}</td>
  //           </tr>
  //           <tr>
  //             <td>InChI</td>
  //             <td colSpan={2} className="long-text">
  //               {record.compound.inchi}
  //             </td>
  //           </tr>
  //           <tr>
  //             <td style={{ borderBottom: borderStyle }}>SMILES</td>
  //             <td
  //               colSpan={2}
  //               className="long-text"
  //               style={{ borderBottom: borderStyle }}
  //             >
  //               {record.compound.smiles}
  //             </td>
  //           </tr>
  //           {record.compound.link && (
  //             <tr>
  //               <td rowSpan={record.compound.link.length + 1}>Links</td>
  //             </tr>
  //           )}
  //           {/* ########### Links ########### */}
  //           {record.compound.link &&
  //             record.compound.link.map((link, i) => (
  //               <tr
  //                 key={
  //                   'link-' + link.database + '-' + link.identifier + '-' + i
  //                 }
  //               >
  //                 <td>{link.database}</td>
  //                 <td>{link.identifier}</td>
  //               </tr>
  //             ))}
  //           {/* ########### Acquisition ########### */}
  //           <tr>
  //             <td
  //               rowSpan={rowSpanAcquisition}
  //               style={{ borderTop: borderStyle }}
  //             >
  //               Acquisition
  //             </td>
  //           </tr>
  //           <tr>
  //             <td style={{ borderTop: borderStyle }}>Instrument</td>
  //             <td className="long-text" style={{ borderTop: borderStyle }}>
  //               {record.acquisition.instrument}
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>Instrument Type</td>
  //             <td className="long-text">
  //               {record.acquisition.instrument_type}
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>MS Type</td>
  //             <td className="long-text">
  //               {record.acquisition.mass_spectrometry.ms_type}
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>Ion Mode</td>
  //             <td className="long-text">
  //               {record.acquisition.mass_spectrometry.ion_mode}
  //             </td>
  //           </tr>
  //           {record.acquisition && record.acquisition.mass_spectrometry && (
  //             <SubTagTableRows
  //               subtags={record.acquisition.mass_spectrometry.subtags}
  //             />
  //           )}
  //           {record.acquisition && record.acquisition.chromatography && (
  //             <SubTagTableRows subtags={record.acquisition.chromatography} />
  //           )}
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

  const titleHeight = 50;
  const imageWidth = 500;
  const headerHeight = 500;
  const chartAndPeakTableHeight = 500;
  const annotationTableHeight = 300;

  const handleOnCopy = useCallback((label: string, text: string) => {
    copyTextToClipboard(label, text);
  }, []);

  const buildSearchUrl = useCallback((label: string, value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(label, value);
    const url =
      import.meta.env.VITE_MB3_FRONTEND_URL +
      routes.search.path +
      `?${searchParams.toString()}`;

    return url;
  }, []);

  const header = useMemo(() => {
    type HeaderTableType = {
      key: string;
      label: string;
      value: JSX.Element;
      copyButton?: JSX.Element;
    };
    const columns = [
      {
        dataIndex: 'label',
        key: 'record-view-header-table-label',
        width: '100px',
        align: 'left' as const,
      },
      {
        dataIndex: 'value',
        key: 'record-view-header-table-value',
        width: 'calc(100% - 100px)',
        align: 'left' as const,
      },
    ];
    const dataSource: HeaderTableType[] = [];
    dataSource.push({
      key: 'record-view-header-table-names',
      label: 'Names',
      value: (
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'left',
          }}
        >
          {record.compound.names.map((name, i) => (
            <ExportableContent
              key={'name-label-' + name}
              component={name}
              componentStyle={{ justifyContent: 'left' }}
              mode="copy"
              onClick={() => handleOnCopy(`${i + 1}. compound name:`, name)}
              width="100%"
              height="100%"
              title="Copy compound name to clipboard"
              enableSearch
              searchTitle="Search for compound name"
              searchUrl={buildSearchUrl('compound_name', name)}
            />
          ))}
        </Content>
      ),
    });
    dataSource.push({
      key: 'record-view-header-table-authors',
      label: 'Authors',
      value: (
        <ExportableContent
          component={record.authors.map((a) => a.name).join(', ')}
          componentStyle={{ justifyContent: 'left' }}
          mode="copy"
          onClick={() =>
            handleOnCopy(
              'Authors',
              record.authors.map((a) => a.name).join(', '),
            )
          }
          width="100%"
          height="100%"
          title="Copy authors to clipboard"
        />
      ),
    });
    dataSource.push({
      key: 'record-view-header-table-smiles',
      label: 'SMILES',
      value: (
        <ExportableContent
          component={record.compound.smiles}
          componentStyle={{ justifyContent: 'left' }}
          mode="copy"
          onClick={() => handleOnCopy('SMILES', record.compound.smiles)}
          width="100%"
          height="100%"
          title="Copy SMILES to clipboard"
          enableSearch
          searchTitle="Search for SMILES"
          searchUrl={buildSearchUrl('substructure', record.compound.smiles)}
        />
      ),
    });
    dataSource.push({
      key: 'record-view-header-table-inchi',
      label: 'InChI',
      value: (
        <ExportableContent
          component={record.compound.inchi}
          componentStyle={{ justifyContent: 'left' }}
          mode="copy"
          onClick={() => handleOnCopy('InChI', record.compound.inchi)}
          width="100%"
          height="100%"
          title="Copy InChi to clipboard"
          enableSearch
          searchTitle="Search for InChI"
          searchUrl={buildSearchUrl('inchi', record.compound.inchi)}
        />
      ),
    });
    dataSource.push({
      key: 'record-view-header-table-splash',
      label: 'SPLASH',
      value: (
        <ExportableContent
          component={record.peak.splash}
          componentStyle={{ justifyContent: 'left' }}
          mode="copy"
          onClick={() => handleOnCopy('SPLASH', record.peak.splash)}
          width="100%"
          height="100%"
          title="Copy SPLASH to clipboard"
          enableSearch
          searchTitle="Search for SPLASH"
          searchUrl={buildSearchUrl('splash', record.peak.splash)}
        />
      ),
    });

    return (
      <Content
        style={{
          width: '100%',
          minHeight: headerHeight,
          // maxHeight: headerHeight,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '1px solid lightgrey',
          backgroundColor: 'white',
        }}
      >
        <ExportableContent
          component={record.title}
          componentStyle={{
            minHeight: titleHeight,
            maxHeight: titleHeight,
            fontSize: 18,
            fontWeight: 'bold',
            padding: 10,
          }}
          mode="copy"
          onClick={() => handleOnCopy('Title', record.title)}
          width="100%"
          height="100%"
          title="Copy title to clipboard"
          buttonStyle={{
            fontSize: undefined,
          }}
        />
        <Content
          style={{
            width: '100%',
            minHeight: headerHeight - titleHeight,
            maxHeight: headerHeight - titleHeight,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Table<HeaderTableType>
            style={{
              minWidth: `calc(100% - ${imageWidth})`,
              maxWidth: `calc(100% - ${imageWidth})`,
              height: '100%',
            }}
            className="record-view-header-table"
            sticky
            pagination={false}
            showHeader={false}
            columns={columns}
            dataSource={dataSource}
          />
          <Content
            style={{
              minWidth: imageWidth,
              maxWidth: imageWidth,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {record.compound.smiles && record.compound.smiles !== '' ? (
              <StructureView
                smiles={record.compound.smiles}
                imageWidth={imageWidth}
                imageHeight={headerHeight - titleHeight - 80}
              />
            ) : undefined}

            <Content
              style={{
                width: imageWidth,
                height: `calc(100% - ${headerHeight - titleHeight} - 80px)`,
                display: 'grid',
                gridTemplateColumns: '65px auto 95px auto',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}
            >
              <label>Formula: </label>
              <ExportableContent
                component={<MF mf={record.compound.formula} />}
                componentStyle={{ fontWeight: 'bolder', marginRight: 20 }}
                mode="copy"
                onClick={() =>
                  copyTextToClipboard(
                    'Molecular Formula',
                    record.compound.formula,
                  )
                }
                width="100%"
                height="100%"
                title="Copy molecular formula to clipboard"
                enableSearch
                searchTitle="Search for molecular formula"
                searchUrl={buildSearchUrl('formula', record.compound.formula)}
              />
              <label style={{ marginLeft: 50 }}>Mass: </label>
              <ExportableContent
                component={record.compound.mass.toString()}
                componentStyle={{ fontWeight: 'bolder', marginRight: 20 }}
                mode="copy"
                onClick={() =>
                  copyTextToClipboard(
                    'Molecular Mass',
                    record.compound.mass.toString(),
                  )
                }
                width="100%"
                height="100%"
                title="Copy molecular mass to clipboard"
                enableSearch
                searchTitle="Search for molecular mass"
                searchUrl={buildSearchUrl(
                  'exact_mass',
                  record.compound.mass.toString(),
                )}
              />
            </Content>
          </Content>
        </Content>
      </Content>
    );
  }, [
    handleOnCopy,
    buildSearchUrl,
    record.authors,
    record.compound.formula,
    record.compound.inchi,
    record.compound.mass,
    record.compound.names,
    record.compound.smiles,
    record.peak.splash,
    record.title,
  ]);

  const spectrumAndPeakTable = useMemo(
    () => (
      <Content style={{ width, height: chartAndPeakTableHeight }}>
        <Resizable
          record={record}
          width={width as number}
          height={chartAndPeakTableHeight}
          minPeakTableWith={imageWidth}
        />
      </Content>
    ),
    [record, width],
  );

  const annotationTable = useMemo(
    () => (
      <AnnotationTable
        annotation={record.peak.annotation}
        width="100%"
        height={annotationTableHeight}
      />
    ),
    [record.peak.annotation],
  );

  return useMemo(
    () => (
      <Content
        style={{
          width,
          height,
          display: 'block',
          // flexDirection: 'column',
          // justifyContent: 'center',
          // alignItems: 'center',
          overflow: 'scroll',
          userSelect: 'none',
        }}
      >
        {header}
        {spectrumAndPeakTable}
        {annotationTable}
      </Content>
    ),
    [annotationTable, header, height, spectrumAndPeakTable, width],
  );
}

export default RecordView;
