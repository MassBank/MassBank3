import './Pagination.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ResultTable from './ResultTable';
import Hit from '../../types/Hit';
import Peak from '../../types/peak/Peak';
import Record from '../../types/record/Record';
import Placeholder from '../basic/Placeholder';
import fetchData from '../../utils/request/fetchData';
import { Button, Dropdown, Modal, Pagination, Select, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import SpectralHitsCarouselView from '../routes/pages/search/SpectralHitsCarouselView';
import ResultTableSortOptionType from '../../types/ResultTableSortOptionType';
import { usePropertiesContext } from '../../context/properties/properties';
import ResultTableSortOption from '../../types/ResultTableSortOption';
import Tooltip from '../basic/Tooltip';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import DownloadFormat from '../../types/DownloadFormat';
import downloadRecords from '../../utils/request/downloadRecords';
import DownloadMenuItems from '../common/DownloadMenuItems';
import RequestResponse from '../../types/RequestResponse';
import ErrorElement from '../basic/ErrorElement';

type InputProps = {
  reference?: Peak[];
  hits: Hit[] | null;
  width: number;
  height: number;
  sortOptions?: ResultTableSortOptionType[];
  onSort?: (value: ResultTableSortOption) => void;
  widthOverview?: number;
  heightOverview?: number;
};

function ResultPanel({
  reference,
  hits,
  width,
  height,
  sortOptions = [],
  onSort = () => {},
  widthOverview = width,
  heightOverview = height,
}: InputProps) {
  const { backendUrl, exportServiceUrl } = usePropertiesContext();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [isRequestingDownload, setIsRequestingDownload] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [resultPageIndex, setResultPageIndex] = useState<number>(0);
  const [selectedSortOption, setSelectedSortOption] = useState<
    ResultTableSortOption | undefined
  >();
  const [hitsWithRecords, setHitsWithRecords] = useState<Hit[] | null>(null);

  const pageLimit = 20;
  const paginationHeight = 50;

  const resultTableData = useMemo(() => {
    const _resultTableData: Hit[][] = [];
    if (!hits) {
      return _resultTableData;
    }
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

  const fetchRecords = useCallback(async () => {
    setIsRequesting(true);

    const _hits =
      resultTableData.length > 0 ? resultTableData[resultPageIndex] : [];

    let _hitsWithRecords: Hit[] = [];
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

      const records: (Record | null)[] = [];
      for (const accession of accessions) {
        const url = backendUrl + '/records/' + accession + '/simple';

        const response = (await fetchData(url)) as RequestResponse<Record>;
        if (response.status === 'error') {
          setErrorMessage(
            `Error fetching record for accession ${accession}: ${response.message}`,
          );
          records.push(null);
          break;
        }
        const record = response.data;

        if (record && typeof record === 'object') {
          record.peak.peak.values = record.peak.peak.values.map((p: Peak) => {
            return {
              mz: p.mz,
              intensity: p.intensity,
              rel: p.rel,
              id: 'peak-' + p.id,
            } as Peak;
          });

          records.push(record);
        } else {
          records.push(null);
        }
      }

      _hitsWithRecords = _hits.slice(from, from + range).map((h, i) => {
        h.record = records[i];
        return h;
      });
    }

    setHitsWithRecords(_hitsWithRecords);
    setIsRequesting(false);
  }, [resultTableData, resultPageIndex, backendUrl]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleOnDoubleClick = useCallback((_slideIndex: number) => {
    setSlideIndex(_slideIndex % pageLimit);
    setShowModal(true);
  }, []);

  const resultTable = useMemo(
    () => (
      <ResultTable
        reference={reference}
        hits={hitsWithRecords ?? []}
        height={height - paginationHeight}
        onDoubleClick={handleOnDoubleClick}
        rowHeight={150}
        chartWidth={250}
        imageWidth={250}
      />
    ),
    [reference, hitsWithRecords, height, handleOnDoubleClick],
  );

  const modal = useMemo(
    () => (
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={widthOverview}
        height={heightOverview}
        centered
        destroyOnHidden
      >
        <SpectralHitsCarouselView
          reference={reference}
          hits={hitsWithRecords || []}
          slideIndex={slideIndex}
          width={widthOverview}
          height={heightOverview}
        />
      </Modal>
    ),
    [
      showModal,
      widthOverview,
      heightOverview,
      reference,
      hitsWithRecords,
      slideIndex,
    ],
  );

  const handleOnSelectPage = useCallback(
    (pageIndex: number | null) => {
      if (
        hits &&
        pageIndex &&
        pageIndex > 0 &&
        pageIndex <= Math.ceil(hits.length / pageLimit)
      ) {
        setResultPageIndex(pageIndex - 1);
      } else {
        setResultPageIndex(0);
      }
    },
    [hits],
  );

  const handleOnSelect = useCallback(
    (value: ResultTableSortOption) => {
      setSelectedSortOption(value);
      onSort(value);
    },
    [onSort],
  );

  const handleOnDownloadResult = useCallback(
    async (format: DownloadFormat) => {
      setIsRequestingDownload(true);

      if (hits) {
        await downloadRecords(
          exportServiceUrl,
          format,
          hits.map((h) => h.accession),
        );
      }

      setIsRequestingDownload(false);
    },
    [exportServiceUrl, hits],
  );

  const downloadMenuItems = useMemo(
    () => DownloadMenuItems({ onDownload: handleOnDownloadResult }),
    [handleOnDownloadResult],
  );

  const paginationContainer = useMemo(
    () => (
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
          className="result-panel-pagination"
          total={hits ? hits.length : 0}
          pageSize={pageLimit}
          showTotal={(total) => (
            <Content
              style={{
                textWrap: 'nowrap',
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'brown',
                width: 150,
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
          locale={{ jump_to: 'Page', page: '' }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textWrap: 'nowrap',
          }}
        />
        {sortOptions.length > 0 && (
          <Select
            defaultValue={selectedSortOption}
            style={{ width: 200 }}
            placeholder={<p style={{ color: 'black' }}>Sort by</p>}
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={sortOptions}
            onSelect={handleOnSelect}
          />
        )}
        <Dropdown menu={{ items: downloadMenuItems }} trigger={['click']}>
          <Button
            style={{
              width: 100,
              marginLeft: 10,
            }}
          >
            Download
          </Button>
        </Dropdown>
        <Tooltip
          title={
            'Double click on a row in the result table to open the carousel view. In addition to clicking through the results, it also offers an interactive chart or mirror chart (similarity/peak search). In case of a neutral loss search it provides an additional interactive result table.'
          }
          placement="left"
        >
          <QuestionCircleTwoTone
            style={{
              width: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10,
              marginRight: 20,
            }}
          />
        </Tooltip>
      </Content>
    ),
    [
      hits,
      handleOnSelectPage,
      resultPageIndex,
      sortOptions,
      selectedSortOption,
      handleOnSelect,
      downloadMenuItems,
    ],
  );

  return useMemo(
    () =>
      resultTableData.length > 0 ? (
        <Content style={{ width, height }}>
          {isRequesting ? (
            <Content
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spin size="large" />
            </Content>
          ) : isRequestingDownload ? (
            <Content
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spin size="large" />
              <label
                style={{ marginTop: 20, fontSize: 16, fontWeight: 'bolder' }}
              >
                Preparing download...
              </label>
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
              {modal}
            </Content>
          )}
        </Content>
      ) : errorMessage ? (
        <ErrorElement message={errorMessage} />
      ) : (
        <Placeholder
          child={'No results'}
          style={{
            width,
            height,
            fontSize: 18,
            fontWeight: 'bold',
            backgroundColor: 'white',
          }}
        />
      ),
    [
      errorMessage,
      height,
      isRequesting,
      isRequestingDownload,
      modal,
      paginationContainer,
      resultTable,
      resultTableData.length,
      width,
    ],
  );
}

export default ResultPanel;
