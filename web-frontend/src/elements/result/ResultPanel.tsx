import { useCallback, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ResultTable from './ResultTable';
import Hit from '../../types/Hit';
import Peak from '../../types/peak/Peak';
import Record from '../../types/Record';
import generateID from '../../utils/generateID';
import SpectralHitsCarouselView from '../routes/pages/search/SpectralHitsCarouselView';
import CustomModal from '../basic/CustomModal';
import Placeholder from '../basic/Placeholder';
import fetchData from '../../utils/fetchData';
import { Button, InputNumber, Pagination, Spin } from 'antd';
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
  widthOverview = width,
  heightOverview = height,
}: InputProps) {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [resultPageIndex, setResultPageIndex] = useState<number>(0);
  const [spectralHitsCarouselView, setSpectralHitsCarouselView] = useState<
    JSX.Element | undefined
  >();

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

  const handleOnDoubleClick = useCallback(
    (_slideIndex: number) => {
      setSlideIndex(_slideIndex);
      setShowModal(true);
    },
    [setShowModal],
  );

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
          onDoubleClick={handleOnDoubleClick}
          rowHeight={150}
          chartWidth={150}
          imageWidth={150}
        />,
      );
      setSpectralHitsCarouselView(
        <SpectralHitsCarouselView
          reference={reference}
          hits={_hitsWithRecords || []}
          slideIndex={slideIndex}
          width={widthOverview}
          height={heightOverview - 50}
        />,
      );
      setIsRequesting(false);
    });
  }, [
    fetchRecords,
    handleOnDoubleClick,
    heightOverview,
    reference,
    resultPageIndex,
    resultTableData,
    slideIndex,
    widthOverview,
  ]);

  useEffect(() => {
    buildResultTable();
  }, [buildResultTable]);

  const customModal = useMemo(
    () => (
      <CustomModal
        show={showModal}
        body={spectralHitsCarouselView}
        onClose={() => setShowModal(false)}
        modalStyle={{
          content: { width: widthOverview, height: heightOverview },
        }}
        header={
          <FontAwesomeIcon
            icon={faTimes}
            style={{ color: 'red', cursor: 'pointer', paddingRight: '20px' }}
            onClick={() => setShowModal(false)}
          />
        }
        headerContainerStyle={{
          width: '100%',
          height: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
        footerContainerStyle={{ display: 'none' }}
      />
    ),
    [heightOverview, showModal, spectralHitsCarouselView, widthOverview],
  );

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
        >{`${hits.length} Results`}</Content>
        <Pagination
          total={Math.ceil(hits.length / pageLimit)}
          onChange={handleOnSelectPage}
          current={resultPageIndex + 1}
          showTitle
          showSizeChanger={false}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        />
        <InputNumber
          onChange={handleOnSelectPage}
          value={resultPageIndex + 1}
          min={1}
          max={Math.ceil(hits.length / pageLimit)}
          addonBefore="Page: "
          style={{
            width: 200,
          }}
        />
        <Button
          children="Download"
          onClick={() => handleOnDownloadResult()}
          style={{
            width: 100,
          }}
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
                height: height - paginationHeight,
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
                height: height - paginationHeight,
                overflow: 'scroll',
              }}
            >
              {paginationContainer}
              {resultTable}
              {customModal}
            </Content>
          )}
        </Content>
      ) : (
        <Placeholder child="No hits found" style={{ width, height }} />
      ),
    [
      customModal,
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
