import './ContentView.scss';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Spinner from '../../../basic/Spinner';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Content from '../../../../types/Content';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import ContentChart from './ContentChart';
import fetchData from '../../../../utils/fetchData';
import buildSearchParams from '../../../../utils/buildSearchParams';
import initFlags from '../../../../utils/initFlags';

import ContentSearchPanel from './ContentSearchPanel';
import SearchResult from '../../../../types/SearchResult';
import Hit from '../../../../types/Hit';
import ResultPanel from '../../../result/ResultPanel';

function ContentView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [browseContent, setBrowseContent] = useState<Content | undefined>();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [hits, setHits] = useState<Hit[]>([]);

  const searchPanelWidth = useMemo(
    () => (collapsed ? 80 : width * 0.3),
    [collapsed, width],
  );

  const handleOnFetchContent = useCallback(
    async (newBrowseContent: Content | undefined) => {
      setIsRequesting(true);

      let _browseContent: Content | undefined = newBrowseContent;
      if (!_browseContent) {
        const url = import.meta.env.VITE_MB3_API_URL + '/v1/filter/browse';
        _browseContent = (await fetchData(url)) as Content;
      } else {
        const searchParams = buildSearchParams(_browseContent);
        const url = import.meta.env.VITE_MB3_API_URL + '/v1/filter/browse';
        _browseContent = (await fetchData(url, searchParams)) as Content;
      }
      initFlags(_browseContent);
      setBrowseContent(_browseContent);
      const searchParams = buildSearchParams(_browseContent);
      const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/search';
      const searchResult = (await fetchData(url, searchParams)) as SearchResult;

      const _hits: Hit[] = searchResult.data
        ? (searchResult.data as Hit[])
        : [];

      setHits(_hits);

      setIsRequesting(false);
    },
    [],
  );

  useEffect(() => {
    handleOnFetchContent(undefined);
  }, [handleOnFetchContent]);

  Chart.register(ArcElement, Tooltip, Legend);

  const charts = useMemo(() => {
    if (browseContent) {
      const keys = Object.keys(browseContent).filter(
        (key) => key !== 'metadata',
      );
      const _charts = keys.map((key) => (
        <ContentChart
          key={'chart_' + key}
          content={browseContent}
          identifier={key}
          width={(width - searchPanelWidth) / keys.length}
        />
      ));

      return (
        <div
          className="content-charts"
          style={{ width: width - searchPanelWidth, height: height / 4 }}
        >
          {_charts}
        </div>
      );
    }

    return undefined;
  }, [browseContent, height, searchPanelWidth, width]);

  const resultPanel = useMemo(() => {
    return (
      <ResultPanel
        reference={[]}
        hits={hits}
        width={width - searchPanelWidth}
        height={(height / 4) * 3}
        widthOverview={width}
        heightOverview={height}
      />
    );
  }, [height, hits, searchPanelWidth, width]);

  const handleOnSubmit = useCallback(
    async (newBrowseContent: Content) => {
      setCollapsed(true);
      await handleOnFetchContent(newBrowseContent);
    },
    [handleOnFetchContent],
  );

  const handleOnCollapse = useCallback((_collapsed: boolean) => {
    setCollapsed(_collapsed);
  }, []);

  const contentSearchPanel = useMemo(
    () => (
      <ContentSearchPanel
        collapsed={collapsed}
        onCollapse={handleOnCollapse}
        msSpecFilterOptions={browseContent}
        onSubmit={handleOnSubmit}
        height={height}
        width={searchPanelWidth}
      />
    ),
    [
      collapsed,
      handleOnCollapse,
      browseContent,
      handleOnSubmit,
      height,
      searchPanelWidth,
    ],
  );

  return (
    <div ref={ref} className="content-view">
      {isRequesting ? (
        <Spinner buttonDisabled buttonStyle={{ display: 'none' }} />
      ) : (
        <div className="inner-content-view" style={{ width, height }}>
          {contentSearchPanel}
          <div
            className="content-result-panel"
            style={{ width: width - searchPanelWidth, height }}
          >
            {charts}
            {resultPanel}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentView;
