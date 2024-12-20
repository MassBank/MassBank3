import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import ContentChart from './ContentChart';
import fetchData from '../../../../utils/fetchData';
import buildSearchParams from '../../../../utils/buildSearchParams';
import initFlags from '../../../../utils/initFlags';

import SearchResult from '../../../../types/SearchResult';
import Hit from '../../../../types/Hit';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Layout, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import massSpecFilterOptionsFormDataToContentMapper from '../../../../utils/massSpecFilterOptionsFormDataToContentMapper';
import SearchAndResultPanel from '../../../common/SearchAndResultPanel';
import CommonSearchPanel from '../../../common/CommonSearchPanel';
import MassSpecFilterOptionsMenuItems from '../search/searchPanel/msSpecFilter/MassSpecFilterOptionsMenuItems';
import Placeholder from '../../../basic/Placeholder';

function ContentView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);

  const [isFetchingContent, setIsFetchingContent] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [hits, setHits] = useState<Hit[]>([]);
  const [massSpecFilterOptions, setMassSpecFilterOptions] = useState<
    ContentFilterOptions | undefined
  >();

  const searchPanelWidth = useMemo(
    () => (isCollapsed ? 50 : Math.max(width * 0.3, 400)),
    [isCollapsed, width],
  );

  const handleOnFetchContent = useCallback(
    async (formDataContent: ContentFilterOptions | undefined) => {
      setIsFetchingContent(true);

      let _browseContent: ContentFilterOptions | undefined = formDataContent;
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

      setMassSpecFilterOptions(_browseContent);
      setIsFetchingContent(false);
    },
    [],
  );

  const handleOnSearch = useCallback(
    async (formDataContent: ContentFilterOptions | undefined) => {
      setIsSearching(true);

      const searchParams = buildSearchParams(formDataContent);
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
      setIsSearching(false);
    },
    [],
  );

  const handleOnSubmit = useCallback(
    async (formData: SearchFields) => {
      setIsCollapsed(true);

      const formDataContent = massSpecFilterOptionsFormDataToContentMapper(
        formData?.massSpecFilterOptions,
        // massSpecFilterOptions,
        undefined,
      );

      await handleOnSearch(formDataContent);
      await handleOnFetchContent(formDataContent);
    },
    [handleOnFetchContent, handleOnSearch],
  );

  useEffect(() => {
    handleOnFetchContent(undefined);
    handleOnSearch(undefined);
  }, [handleOnFetchContent, handleOnSearch]);

  const heights = useMemo(() => {
    return {
      chartPanelHeight: height / 4,
      searchPanelHeight: (height / 4) * 3,
    };
  }, [height]);

  const charts = useMemo(() => {
    if (massSpecFilterOptions) {
      const keys = Object.keys(massSpecFilterOptions).filter(
        (key) => key !== 'metadata',
      );
      const _charts = keys.map((key) => (
        <ContentChart
          key={'chart_' + key}
          content={massSpecFilterOptions}
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

    return (
      <Placeholder
        style={{
          width,
          height: heights.chartPanelHeight,
          color: 'red',
          fontSize: 18,
          fontWeight: 'bold',
        }}
        child={'Could not render charts'}
      />
    );
  }, [heights.chartPanelHeight, massSpecFilterOptions, width]);

  const handleOnCollapse = useCallback((_collapsed: boolean) => {
    setIsCollapsed(_collapsed);
  }, []);

  const searchAndResultPanel = useMemo(() => {
    const searchPanel = (
      <CommonSearchPanel
        items={MassSpecFilterOptionsMenuItems({
          massSpecFilterOptions,
        })}
        collapsed={isCollapsed}
        onCollapse={handleOnCollapse}
        massSpecFilterOptions={massSpecFilterOptions}
        onSubmit={handleOnSubmit}
        width={searchPanelWidth}
        height={heights.searchPanelHeight}
      />
    );

    return (
      <SearchAndResultPanel
        searchPanel={searchPanel}
        width={width}
        height={heights.searchPanelHeight}
        searchPanelWidth={searchPanelWidth}
        searchPanelHeight={heights.searchPanelHeight}
        widthOverview={width}
        heightOverview={height}
        reference={[]}
        hits={hits}
        isRequesting={isSearching}
      />
    );
  }, [
    massSpecFilterOptions,
    isCollapsed,
    handleOnCollapse,
    handleOnSubmit,
    searchPanelWidth,
    heights.searchPanelHeight,
    width,
    height,
    hits,
    isSearching,
  ]);

  return useMemo(
    () => (
      <Layout
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin size="large" spinning={isFetchingContent} />
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: isFetchingContent ? 'none' : 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {charts}
          {searchAndResultPanel}
        </Content>
      </Layout>
    ),
    [charts, isFetchingContent, searchAndResultPanel],
  );
}

export default ContentView;
