import { useCallback, useEffect, useMemo, useState } from 'react';
import ResultTable from './ResultTable';
import Hit from '../../types/Hit';
import Peak from '../../types/peak/Peak';
import Record from '../../types/Record';
import generateID from '../../utils/generateID';
import Placeholder from '../basic/Placeholder';
import fetchData from '../../utils/fetchData';
import { Button, Pagination, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';

type InputProps = {
  reference?: Peak[];
  hits: Hit[];
  width: number;
  height: number;
  widthOverview?: number;
  heightOverview?: number;
};

function ResultPanel({
  reference,
  hits,
  width,
  height,
  // widthOverview = width,
  // heightOverview = height,
}: InputProps) {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  // const [showModal, setShowModal] = useState<boolean>(false);
  // const [slideIndex, setSlideIndex] = useState<number>(0);
  const [resultPageIndex, setResultPageIndex] = useState<number>(0);
  // const [spectralHitsCarouselView, setSpectralHitsCarouselView] = useState<
  // JSX.Element | undefined
  // >();

  const pageLimit = 20;
  const paginationHeight = 50;

  const resultTableData = useMemo(() => {
    const _resultTableData: Hit[][] = [];
    let counter = 0;
    let resultHits: Hit[] = [];

    for (let i = 0; i < hits.length; i++) {
      if (counter < pageLimit) {
        resultHits.push(hits[i]);
        counter++;
      } else {
        _resultTableData.push(resultHits);
        resultHits = [hits[i]];
        counter = 1;
      }
    }
    if (resultHits.length > 0) {
      _resultTableData.push(resultHits);
    }

    return _resultTableData;
  }, [hits]);

  const fetchRecords = useCallback(async (_hits: Hit[]) => {
    if (_hits.length > 0) {
      const from = 0;
      let to = pageLimit;
      if (to > _hits.length) {
        to = _hits.length;
      }

      const range = to - from;
      const accessions = _hits
        .slice(from, from + range)
        .map((h) => h.accession);

      const records: (Record | undefined)[] = [];
      for (const accession of accessions) {
        const url =
          import.meta.env.VITE_MB3_API_URL +
          '/v1/records/' +
          accession +
          '/simple';

        const record = await fetchData(url);

        if (record) {
          record.peak.peak.values = record.peak.peak.values.map((p) => ({
            ...p,
            id: generateID(),
          }));
          records.push(record);
        } else {
          records.push(undefined);
        }
      }

      const _hitsWithRecords = _hits.slice(from, from + range).map((h, i) => {
        h.record = records[i];
        return h;
      });

      return _hitsWithRecords;
    }
  }, []);

  const [resultTable, setResultTable] = useState<JSX.Element | undefined>();

  // const handleOnDoubleClick = useCallback(
  //   (_slideIndex: number) => {
  //     setSlideIndex(_slideIndex);
  //     setShowModal(true);
  //   },
  //   [setShowModal],
  // );

  const buildResultTable = useCallback(() => {
    setIsRequesting(true);
    const _hits =
      resultTableData.length > 0 ? resultTableData[resultPageIndex] : [];

    fetchRecords(_hits).then((_hitsWithRecords) => {
      setResultTable(
        <ResultTable
          reference={reference}
          hits={_hitsWithRecords || []}
          offset={resultPageIndex * pageLimit}
          height={height - paginationHeight}
          // onDoubleClick={handleOnDoubleClick}
          rowHeight={150}
          chartWidth={150}
          imageWidth={150}
        />,
      );
      // setSpectralHitsCarouselView(
      //   <SpectralHitsCarouselView
      //     reference={reference}
      //     hits={_hitsWithRecords || []}
      //     slideIndex={slideIndex}
      //     width={widthOverview}
      //     height={heightOverview}
      //   />,
      // );
      setIsRequesting(false);
    });
  }, [fetchRecords, height, reference, resultPageIndex, resultTableData]);

  useEffect(() => {
    buildResultTable();
  }, [buildResultTable]);

  // const modal = useMemo(
  //   () => (
  //     <Modal
  //       open={showModal}
  //       onCancel={() => setShowModal(false)}
  //       footer={null}
  //       width={widthOverview}
  //       height={heightOverview}
  //       centered
  //     >
  //       {spectralHitsCarouselView}
  //     </Modal>
  //   ),
  //   [heightOverview, showModal, spectralHitsCarouselView, widthOverview],
  // );

  const handleOnSelectPage = useCallback(
    (pageIndex: number | null) => {
      if (
        pageIndex &&
        pageIndex > 0 &&
        pageIndex <= Math.ceil(hits.length / pageLimit)
      ) {
        setResultPageIndex(pageIndex - 1);
      }
    },
    [hits.length],
  );

  const handleOnDownloadResult = useCallback(() => {
    console.log('Download result');
  }, []);

  const paginationContainer = useMemo(() => {
    return (
      <Content
        style={{
          width: '100%',
          height: paginationHeight,
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <Pagination
          total={hits.length}
          pageSize={pageLimit}
          showTotal={(total) => (
            <Content
              style={{
                textWrap: 'nowrap',
                textAlign: 'center',
                fontWeight: 'bold',
                width: 200,
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >{`${total} Results`}</Content>
          )}
          onChange={handleOnSelectPage}
          current={resultPageIndex + 1}
          showTitle
          showSizeChanger={false}
          showQuickJumper
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        />

        <Button
          children="Download"
          onClick={() => handleOnDownloadResult()}
          style={{
            width: 100,
            marginRight: 30,
            marginLeft: 20,
          }}
          disabled
        />
      </Content>
    );
  }, [
    handleOnDownloadResult,
    handleOnSelectPage,
    hits.length,
    resultPageIndex,
  ]);

  return useMemo(
    () =>
      resultTableData.length > 0 ? (
        <Content style={{ width, height }}>
          {isRequesting ? (
            <Content
              style={{
                width: '100%',
                height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spin size="large" />
            </Content>
          ) : (
            <Content
              style={{
                width: '100%',
                height,
                overflow: 'scroll',
              }}
            >
              {paginationContainer}
              {resultTable}
              {/* {modal} */}
            </Content>
          )}
        </Content>
      ) : (
        <Placeholder child="No hits found" style={{ width, height }} />
      ),
    [
      height,
      isRequesting,
      paginationContainer,
      resultTable,
      resultTableData.length,
      width,
    ],
  );
}

export default ResultPanel;
