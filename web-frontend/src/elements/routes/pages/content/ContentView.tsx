import './ContentView.scss';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Spinner from '../../../basic/Spinner';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Content from '../../../../types/Content';
import ValueCount from '../../../../types/ValueCount';
import axios from 'axios';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import SearchParams from '../../../../types/SearchParams';
import Button from '../../../basic/Button';
import ContentTable from './ContentTable';
import ContentChart from './ContentChart';

function ContentView() {
  const ref = useRef(null);
  const { width } = useContainerDimensions(ref);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [recordCount, setRecordCount] = useState<number | undefined>();
  const [content, setContent] = useState<Content | undefined>();
  const [content2, setContent2] = useState<Content | undefined>();
  // const [hits, setHits] = useState<Hit[]>([]);

  async function fetchData(url: string, searchParams?: SearchParams) {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.keys(searchParams).forEach((key) => {
        params.append(key, searchParams[key].join(','));
      });
    }
    const resp = await axios.get(url, { params });
    if (resp.status === 200) {
      return await resp.data;
    }

    return undefined;
  }

  const handleOnFetchCount = useCallback(async () => {
    setIsRequesting(true);

    const urlRecordCount =
      import.meta.env.VITE_MB3_API_URL + '/v1/records/count';
    const count: number | undefined = await fetchData(urlRecordCount);

    setRecordCount(count);
    setIsRequesting(false);
  }, []);

  function buildSearchParams(cont: Content | undefined) {
    const searchParams: SearchParams = {};
    if (cont) {
      Object.keys(cont)
        .filter((k) => k !== 'metadata')
        .forEach((k) => {
          const valueCounts = cont[k] as ValueCount[];
          const filtered = valueCounts
            .filter((_vc) => _vc.flag === true)
            .map((_vc) => _vc.value);
          if (filtered.length !== valueCounts.length) {
            searchParams[k] = filtered;
          }
        });
    }

    return searchParams;
  }

  function initFlags(cont: Content) {
    const keys = Object.keys(cont).filter((key) => key !== 'metadata');
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      cont[key] = (cont[key] as ValueCount[]).map((vc) => {
        return {
          ...vc,
          count: vc.count || 0,
          flag: vc.count !== undefined && vc.count > 0,
        };
      });
    }

    return cont;
  }

  const handleOnFetchContent = useCallback(
    async (prevContent: Content | undefined) => {
      setIsRequesting(true);

      const url = import.meta.env.VITE_MB3_API_URL + '/v1/filter/browse';
      const searchParams = buildSearchParams(prevContent);
      const newContent = (await fetchData(url, searchParams)) as Content;

      // const url2 = import.meta.env.VITE_MB3_API_URL + '/v1/records/simple';
      // const _records = await fetchData(url2, searchParams);
      // const _hits: Hit[] = _records.map((r: Record) => {
      //   const hit: Hit = {
      //     accession: r.accession,
      //     record: r,
      //   };

      //   return hit;
      // });

      initFlags(newContent);
      setContent(newContent);
      setContent2({ ...newContent });

      // setHits(_hits);

      setIsRequesting(false);
    },
    [],
  );

  const handleOnSelect = useCallback(
    (
      key: string,
      value: string | undefined,
      isChecked: boolean | undefined,
    ) => {
      if (content2) {
        const _content = { ...content2 };
        const valueCounts = [...(_content[key] as ValueCount[])];
        if (value === undefined || isChecked === undefined) {
          const allSet =
            valueCounts.filter((vc) => vc.flag === true).length ===
            valueCounts.length;
          _content[key] = valueCounts.map((vc) => {
            return { ...vc, flag: !allSet };
          });
        } else {
          _content[key] = valueCounts.map((vc) =>
            vc.value === value ? { ...vc, flag: isChecked } : vc,
          );
        }

        setContent2(_content);
      }
    },
    [content2],
  );

  useEffect(() => {
    handleOnFetchCount();
    handleOnFetchContent(undefined);
  }, [handleOnFetchCount, handleOnFetchContent]);

  Chart.register(ArcElement, Tooltip, Legend);

  const charts = useMemo(() => {
    if (content) {
      const keys = Object.keys(content).filter((key) => key !== 'metadata');
      const _charts = keys.map((key) => (
        <ContentChart
          key={'chart_' + key}
          content={content}
          identifier={key}
          width={width / 4}
        />
      ));

      return <div className="content-charts">{_charts}</div>;
    }

    return undefined;
  }, [content, width]);

  const contentTable = useMemo(
    () => <ContentTable content={content2} onSelect={handleOnSelect} />,
    [content2, handleOnSelect],
  );

  const searchButton = useMemo(
    () => (
      <Button
        child={'Search'}
        onClick={() => handleOnFetchContent(content2)}
        style={{
          width: '100%',
          height: '50px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'blue',
        }}
      />
    ),
    [content2, handleOnFetchContent],
  );

  // const resultPanel = useMemo(() => {
  //   return (
  //     <ResultPanel
  //       reference={[]}
  //       hits={hits}
  //       width={width}
  //       height={height}
  //       widthOverview={width}
  //       heightOverview={height}
  //     />
  //   );
  // }, [height, hits, width]);

  return (
    <div ref={ref} className="content-view">
      {isRequesting ? (
        <Spinner buttonDisabled buttonStyle={{ display: 'none' }} />
      ) : (
        <>
          <h2>
            {recordCount
              ? `MassBank has ${recordCount} entries!`
              : 'Could not fetch record count!'}
          </h2>

          {charts}
          {contentTable}
          {searchButton}
          {/* {resultPanel} */}
        </>
      )}
    </div>
  );
}

export default ContentView;
