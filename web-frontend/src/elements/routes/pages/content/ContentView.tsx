import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import ContentChart from './ContentChart';
import fetchData from '../../../../utils/fetchData';
import buildSearchParams from '../../../../utils/buildSearchParams';
import initFlags from '../../../../utils/initFlags';

import ContentSearchPanel from './ContentSearchPanel';
import SearchResult from '../../../../types/SearchResult';
import Hit from '../../../../types/Hit';
import ResultPanel from '../../../result/ResultPanel';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Layout, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import Placeholder from '../../../basic/Placeholder';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import massSpecFilterOptionsFormDataToContentMapper from '../../../../utils/massSpecFilterOptionsFormDataToContentMapper';

function ContentView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [browseContent, setBrowseContent] = useState<
    ContentFilterOptions | undefined
  >();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [hits, setHits] = useState<Hit[]>([]);

  const searchPanelWidth = useMemo(
    () => (collapsed ? 50 : Math.max(width * 0.3, 400)),
    [collapsed, width],
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

  const resultPanel = useMemo(() => {
    return (
      <ResultPanel
        reference={[]}
        hits={hits}
        width={width - searchPanelWidth}
        height={heights.searchPanelHeight}
        widthOverview={width}
        heightOverview={height}
      />
    );
  }, [height, heights.searchPanelHeight, hits, searchPanelWidth, width]);

  const handleOnSubmit = useCallback(
    async (formData: SearchFields) => {
      setCollapsed(true);

      const formData_content = massSpecFilterOptionsFormDataToContentMapper(
        formData.massSpecFilterOptions,
        browseContent,
      );
      await handleOnFetchContent(formData_content);
    },
    [browseContent, handleOnFetchContent],
  );

  const handleOnCollapse = useCallback((_collapsed: boolean) => {
    setCollapsed(_collapsed);
  }, []);

  const contentSearchPanel = useMemo(
    () => (
      <ContentSearchPanel
        collapsed={collapsed}
        onCollapse={handleOnCollapse}
        content={browseContent}
        onSubmit={handleOnSubmit}
        width={searchPanelWidth}
        height={heights.searchPanelHeight}
      />
    ),
    [
      collapsed,
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
          <Content
            style={{
              width,
              height: heights.searchPanelHeight,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Sider width={searchPanelWidth}>{contentSearchPanel}</Sider>
            <Content
              style={{
                width: width - searchPanelWidth,
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {isRequesting ? (
                <Spin size="large" />
              ) : hits.length > 0 ? (
                resultPanel
              ) : (
                <Placeholder
                  child={collapsed ? 'No results' : ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                />
              )}
            </Content>
          </Content>
        </Content>
      </Layout>
    ),
    [
      charts,
      collapsed,
      contentSearchPanel,
      heights.searchPanelHeight,
      hits.length,
      isRequesting,
      resultPanel,
      searchPanelWidth,
      width,
    ],
  );
}

export default ContentView;
