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
  const { width, height } = useContainerDimensions(ref);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [recordCount, setRecordCount] = useState<number | undefined>();
  const [content, setContent] = useState<Content | undefined>();
  const [content2, setContent2] = useState<Content | undefined>();

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
    console.error(resp.statusText);

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

    console.log(cont);
    console.log(searchParams);

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
      const newContent = (await fetchData(
        url,
        buildSearchParams(prevContent),
      )) as Content;

      initFlags(newContent);
      setContent(newContent);
      setContent2({ ...newContent });

      setIsRequesting(false);
    },
    [],
  );

  const handleOnSelect = useCallback(
    (key: string, value: string, isChecked: boolean) => {
      if (content2) {
        const _content = { ...content2 };
        _content[key] = [...(_content[key] as ValueCount[])].map((vc) =>
          vc.value === value ? { ...vc, flag: isChecked } : vc,
        );

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
          width={width}
        />
      ));

      return (
        <div
          className="content-charts"
          style={{
            width,
            height,
          }}
        >
          {_charts}
        </div>
      );
    }

    return undefined;
  }, [content, height, width]);

  const searchButton = useMemo(
    () => (
      <Button child={'Search'} onClick={() => handleOnFetchContent(content2)} />
    ),
    [content2, handleOnFetchContent],
  );

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
          {content2 ? (
            <ContentTable content={content2} onSelect={handleOnSelect} />
          ) : undefined}
          {searchButton}
        </>
      )}
    </div>
  );
}

export default ContentView;
