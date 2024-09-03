import './ResultPanel.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ResultTable from './ResultTable';
import Hit from '../../types/Hit';
import Peak from '../../types/peak/Peak';
import Record from '../../types/Record';
import generateID from '../../utils/generateID';
import SpectralHitsCarouselView from '../routes/pages/search/SpectralHitsCarouselView';
import CustomModal from '../basic/CustomModal';
import Pagination from '../basic/Pagination';
import Placeholder from '../basic/Placeholder';
import Spinner from '../basic/Spinner';

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
        const resp = await axios.get(url);
        if (resp.status === 200) {
          const record = await resp.data;

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
          onDoubleClick={(_slideIndex: number) => {
            setSlideIndex(_slideIndex);
            setShowModal(true);
          }}
          rowHeight={200}
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

  const pagination = useMemo(
    () => (
      <Pagination
        total={Math.ceil(hits.length / pageLimit)}
        onPageChange={(pageIndex: number) => setResultPageIndex(pageIndex - 1)}
        style={{ height: '50px' }}
      />
    ),
    [hits.length],
  );

  return resultTableData.length > 0 ? (
    <div className="result-container" style={{ width, height }}>
      <p className="hit-count-paragraph">{`${hits.length} hits were found!`}</p>
      {pagination}
      {isRequesting ? (
        <Spinner buttonDisabled={true} />
      ) : (
        <div className="result-table-modal-container">
          {resultTable}
          {customModal}
        </div>
      )}
    </div>
  ) : (
    <Placeholder child="No hits found" style={{ width, height }} />
  );
}

export default ResultPanel;
