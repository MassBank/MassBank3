import './ResultPanel.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Hit from '../../../../../types/Hit';
import Record from '../../../../../types/Record';
import generateID from '../../../../../utils/generateID';
import axios from 'axios';
import Peak from '../../../../../types/peak/Peak';
import CustomModal from '../../../../basic/CustomModal';
import SpectralHitsCarouselView from '../SpectralHitsCarouselView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../../basic/Pagination';
import ResultTable from './ResultTable';
import Spinner from '../../../../basic/Spinner';
import Placeholder from '../../../../basic/Placeholder';

type InputProps = {
  hits: Hit[];
  reference: Peak[];
  width: number;
  height: number;
  widthOverview?: number;
  heightOverview?: number;
};

function ResultPanel({
  hits,
  reference,
  width,
  height,
  widthOverview = width,
  heightOverview = height,
}: InputProps) {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [resultPageIndex, setResultPageIndex] = useState<number>(0);
  const [spectralHitsCarouselView, setSpectralHitsCarouselView] = useState<
    JSX.Element | undefined
  >();

  const pageLimit = 10;

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
      const from = 0; //resultPageIndex * pageLimit;
      let to = 10; //from + pageLimit;
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
          import.meta.env.VITE_MB3_API_URL + '/v1/records/' + accession;
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
          onDoubleClick={() => setShowModal(true)}
          rowHeight={200}
        />,
      );
      setSpectralHitsCarouselView(
        <SpectralHitsCarouselView
          reference={reference}
          hits={_hitsWithRecords || []}
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

  const handleOnPageChange = useCallback(
    (pageIndex: number) => setResultPageIndex(pageIndex - 1),
    [],
  );

  const pagination = useMemo(
    () => (
      <Pagination
        total={Math.ceil(hits.length / pageLimit)}
        onPageChange={handleOnPageChange}
        style={{ height: '50px' }}
      />
    ),
    [handleOnPageChange, hits.length],
  );

  return resultTableData.length > 0 ? (
    <div className="result-container" style={{ width, height }}>
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
