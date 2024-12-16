import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import ContentChart from './ContentChart';
import fetchData from '../../../../utils/fetchData';
import buildSearchParams from '../../../../utils/buildSearchParams';
import initFlags from '../../../../utils/initFlags';

import ContentSearchPanel from './ContentSearchPanel';
import SearchResult from '../../../../types/SearchResult';
import Hit from '../../../../types/Hit';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import massSpecFilterOptionsFormDataToContentMapper from '../../../../utils/massSpecFilterOptionsFormDataToContentMapper';
import SearchAndResultPanel from '../../../result/SearchAndResultPanel';

function ContentView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);

  const [browseContent, setBrowseContent] = useState<
    ContentFilterOptions | undefined
  >();
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [hits, setHits] = useState<Hit[]>([]);

  const searchPanelWidth = useMemo(
    () => (isCollapsed ? 50 : Math.max(width * 0.3, 400)),
    [isCollapsed, width],
  );

  const handleOnFetchContent = useCallback(
    async (newBrowseContent: ContentFilterOptions | undefined) => {
      setIsRequesting(true);

      let _browseContent: ContentFilterOptions | undefined = newBrowseContent;
      if (!_browseContent) {
        const url = import.meta.env.VITE_MB3_API_URL + '/v1/filter/browse';
        _browseContent = (await fetchData(url)) as ContentFilterOptions;
      } else {
        const searchParams = buildSearchParams(_browseContent);
        const url = import.meta.env.VITE_MB3_API_URL + '/v1/filter/browse';
        _browseContent = (await fetchData(
          url,
          searchParams,
        )) as ContentFilterOptions;
      }
      initFlags(_browseContent);
      setBrowseContent(_browseContent);
      const searchParams = buildSearchParams(_browseContent);
      const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/search';
      const searchResult = (await fetchData(url, searchParams)) as SearchResult;

      let _hits: Hit[] = searchResult.data ? (searchResult.data as Hit[]) : [];
      _hits = _hits.map((hit, i) => {
        return {
          ...hit,
          index: i,
        };
      });

      setHits(_hits);
      setIsRequesting(false);
    },
    [],
  );

  useEffect(() => {
    handleOnFetchContent(undefined);
  }, [handleOnFetchContent]);

  const heights = useMemo(() => {
    return {
      chartPanelHeight: height / 4,
      searchPanelHeight: (height / 4) * 3,
    };
  }, [height]);

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
          width={width / keys.length}
          height={heights.chartPanelHeight}
        />
      ));

      return (
        <Content
          style={{
            width,
            height: heights.chartPanelHeight,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#fcfff0',
          }}
        >
          {_charts}
        </Content>
      );
    }

    return undefined;
  }, [browseContent, heights.chartPanelHeight, width]);

  const handleOnSubmit = useCallback(
    async (formData: SearchFields) => {
      setIsCollapsed(true);

      const formData_content = massSpecFilterOptionsFormDataToContentMapper(
        formData.massSpecFilterOptions,
        browseContent,
      );
      await handleOnFetchContent(formData_content);
    },
    [browseContent, handleOnFetchContent],
  );

  const handleOnCollapse = useCallback((_collapsed: boolean) => {
    setIsCollapsed(_collapsed);
  }, []);

  const contentSearchPanel = useMemo(
    () => (
      <ContentSearchPanel
        collapsed={isCollapsed}
        onCollapse={handleOnCollapse}
        content={browseContent}
        onSubmit={handleOnSubmit}
        width={searchPanelWidth}
        height={heights.searchPanelHeight}
      />
    ),
    [
      isCollapsed,
      handleOnCollapse,
      browseContent,
      handleOnSubmit,
      searchPanelWidth,
      heights.searchPanelHeight,
    ],
  );

  return useMemo(
    () => (
      <Layout ref={ref} style={{ width: '100%', height: '100%' }}>
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
          {charts}
          <SearchAndResultPanel
            searchPanel={contentSearchPanel}
            width={width}
            height={heights.searchPanelHeight}
            searchPanelWidth={searchPanelWidth}
            searchPanelHeight={heights.searchPanelHeight}
            isRequesting={isRequesting}
            reference={[]}
            hits={hits}
          />
        </Content>
      </Layout>
    ),
    [
      charts,
      contentSearchPanel,
      heights.searchPanelHeight,
      hits,
      isRequesting,
      searchPanelWidth,
      width,
    ],
  );
}

export default ContentView;
