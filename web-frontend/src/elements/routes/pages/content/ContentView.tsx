import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import ContentChart from './ContentChart';
import fetchData from '../../../../utils/request/fetchData';
import buildSearchParams from '../../../../utils/request/buildSearchParams';
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
import { usePropertiesContext } from '../../../../context/properties/properties';
import SectionDivider from '../../../basic/SectionDivider';
import MetadataPanel from './MetadataPanel';
import Metadata from '../../../../types/Metadata';

function ContentView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const { backendUrl } = usePropertiesContext();

  const [isFetchingContent, setIsFetchingContent] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [massSpecFilterOptions, setMassSpecFilterOptions] = useState<
    ContentFilterOptions | undefined
  >();
  const [metadata, setMetadata] = useState<Metadata | undefined>();

  const searchPanelWidth = useMemo(
    () => (isCollapsed ? 50 : Math.max(width * 0.3, 400)),
    [isCollapsed, width],
  );

  const handleOnFetchContent = useCallback(
    async (formDataContent: ContentFilterOptions | undefined) => {
      setIsFetchingContent(true);

      let _browseContent: ContentFilterOptions | undefined = formDataContent;
      if (!_browseContent) {
        const url = backendUrl + '/v1/filter/browse';
        _browseContent = (await fetchData(url)) as ContentFilterOptions;
      } else {
        const searchParams = buildSearchParams(_browseContent);
        const url = backendUrl + '/v1/filter/browse';
        _browseContent = (await fetchData(
          url,
          searchParams,
        )) as ContentFilterOptions;
      }
      initFlags(_browseContent);
      setMassSpecFilterOptions(_browseContent);

      const url = backendUrl + '/v1/metadata';
      const metadata = (await fetchData(url)) as Metadata;
      setMetadata(metadata);

      setIsFetchingContent(false);
    },
    [backendUrl],
  );

  const handleOnSearch = useCallback(
    async (formDataContent: ContentFilterOptions | undefined) => {
      setIsSearching(true);

      const searchParams = buildSearchParams(formDataContent);
      const url = backendUrl + '/v1/records/search';
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
    [backendUrl],
  );

  const handleOnSubmit = useCallback(
    async (formData: SearchFields) => {
      // setIsCollapsed(true);

      const formDataContent = massSpecFilterOptionsFormDataToContentMapper(
        formData?.propertyFilterOptions,
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

  const heights = {
    chartPanelHeight: 600,
    searchPanelHeight: 600,
  };

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
          width={width / 2}
          height={heights.chartPanelHeight / 2}
        />
      ));

      return (
        <Content
          style={{
            width,
            height: heights.chartPanelHeight,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
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
        child={''}
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
          userSelect: 'none',
        }}
      >
        <Spin size="large" spinning={isFetchingContent} />
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: isFetchingContent ? 'none' : 'block',
            overflow: 'scroll',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          {searchAndResultPanel}
          <SectionDivider label="Charts (Selection)" />
          {charts}
          <SectionDivider label="Information" />
          <MetadataPanel metadata={metadata} />
        </Content>
      </Layout>
    ),
    [charts, isFetchingContent, metadata, searchAndResultPanel],
  );
}

export default ContentView;
