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

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [filterOptionsAndHits, setFilterOptionsAndHits] = useState<{
    massSpecFilterOptions: ContentFilterOptions;
    hits: Hit[];
  }>({
    massSpecFilterOptions: {} as ContentFilterOptions,
    hits: [],
  });

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

      setFilterOptionsAndHits({
        massSpecFilterOptions: _browseContent,
        hits: _hits,
      });

      setIsRequesting(false);
    },
    [],
  );

  const handleOnSubmit = useCallback(
    async (formData: SearchFields) => {
      setIsCollapsed(true);

      const formData_content = massSpecFilterOptionsFormDataToContentMapper(
        formData.massSpecFilterOptions,
        filterOptionsAndHits.massSpecFilterOptions,
      );
      await handleOnFetchContent(formData_content);
    },
    [filterOptionsAndHits.massSpecFilterOptions, handleOnFetchContent],
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
    if (filterOptionsAndHits.massSpecFilterOptions) {
      const keys = Object.keys(
        filterOptionsAndHits.massSpecFilterOptions,
      ).filter((key) => key !== 'metadata');
      const _charts = keys.map((key) => (
        <ContentChart
          key={'chart_' + key}
          content={filterOptionsAndHits.massSpecFilterOptions}
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
  }, [
    filterOptionsAndHits.massSpecFilterOptions,
    heights.chartPanelHeight,
    width,
  ]);

  const handleOnCollapse = useCallback((_collapsed: boolean) => {
    setIsCollapsed(_collapsed);
  }, []);

  const searchAndResultPanel = useMemo(() => {
    const searchPanel = (
      <CommonSearchPanel
        items={MassSpecFilterOptionsMenuItems({
          massSpecFilterOptions: filterOptionsAndHits.massSpecFilterOptions,
        })}
        collapsed={isCollapsed}
        onCollapse={handleOnCollapse}
        massSpecFilterOptions={filterOptionsAndHits.massSpecFilterOptions}
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
        hits={filterOptionsAndHits.hits}
      />
    );
  }, [
    filterOptionsAndHits.massSpecFilterOptions,
    filterOptionsAndHits.hits,
    isCollapsed,
    handleOnCollapse,
    handleOnSubmit,
    searchPanelWidth,
    heights.searchPanelHeight,
    width,
    height,
  ]);

  return useMemo(
    () => (
      <Layout
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin size="large" spinning={isRequesting} />
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: isRequesting ? 'none' : 'flex',
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
    [charts, isRequesting, searchAndResultPanel],
  );
}

export default ContentView;
