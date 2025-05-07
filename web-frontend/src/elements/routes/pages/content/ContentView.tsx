import { lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import fetchData from '../../../../utils/request/fetchData';
import buildSearchParams from '../../../../utils/request/buildSearchParams';
import initFlags from '../../../../utils/initFlags';
import SearchResult from '../../../../types/SearchResult';
import Hit from '../../../../types/Hit';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Layout, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import propertyFilterOptionsFormDataToContentMapper from '../../../../utils/propertyFilterOptionsFormDataToContentMapper';
import SearchAndResultPanel from '../../../common/SearchAndResultPanel';
import CommonSearchPanel from '../../../common/CommonSearchPanel';
import PropertyFilterOptionsMenuItems from '../search/searchPanel/msSpecFilter/PropertyFilterOptionsMenuItems';
import Placeholder from '../../../basic/Placeholder';
import { usePropertiesContext } from '../../../../context/properties/properties';
import SectionDivider from '../../../basic/SectionDivider';
import MetadataPanel from './MetadataPanel';
import Metadata from '../../../../types/Metadata';
import defaultSearchFieldValues from '../../../../constants/defaultSearchFieldValues';
import ResultTableSortOption from '../../../../types/ResultTableSortOption';
import sortHits from '../../../../utils/sortHits';
import collapseButtonWidth from '../../../../constants/collapseButtonWidth';
import Segmented from '../../../basic/Segmented';
import segmentedWidth from '../../../../constants/segmentedWidth';
import buildClassificationData from '../../../../utils/buildClassificationData';
import ClassificationPanel from './ClassificationPanel';
import NotAvailableLabel from '../../../basic/NotAvailableLabel';

const ContentChart = lazy(() => import('./ContentChart'));

const defaultSearchPanelWidth = 450;

function ContentView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const { backendUrl } = usePropertiesContext();

  const [isFetchingContent, setIsFetchingContent] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [propertyFilterOptions, setPropertyFilterOptions] = useState<
    ContentFilterOptions | undefined
  >();
  const [metadata, setMetadata] = useState<Metadata | undefined>();
  const [searchPanelWidth, setSearchPanelWidth] = useState<number>(
    defaultSearchPanelWidth,
  );

  const handleOnFetchContent = useCallback(
    async (formDataContent: ContentFilterOptions | undefined) => {
      setIsFetchingContent(true);

      let _browseContent: ContentFilterOptions | undefined = formDataContent;
      if (!_browseContent) {
        const url = backendUrl + '/filter/browse';
        _browseContent = (await fetchData(url)) as ContentFilterOptions;
      } else {
        const searchParams = buildSearchParams(_browseContent);
        const url = backendUrl + '/filter/browse';
        _browseContent = (await fetchData(
          url,
          searchParams,
        )) as ContentFilterOptions;
      }
      initFlags(_browseContent);
      setPropertyFilterOptions(_browseContent);

      const url = backendUrl + '/metadata';
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
      const url = backendUrl + '/records/search';
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
      // setSearchPanelWidth(collapseButtonWidth);

      const formDataContent = propertyFilterOptionsFormDataToContentMapper(
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

  const heights = useMemo(() => {
    return {
      chartPanelHeight: height * 0.9,
      searchPanelHeight: height * 0.9,
      classificationPanelHeight: height * 0.9,
    };
  }, [height]);

  const charts = useMemo(() => {
    if (propertyFilterOptions) {
      const keys = Object.keys(propertyFilterOptions).filter(
        (key) => key !== 'metadata',
      );
      const _charts = keys.map((key) => (
        <ContentChart
          key={'chart_' + key}
          content={propertyFilterOptions}
          identifier={key}
          width={(width - segmentedWidth) / 2}
          height={heights.chartPanelHeight / 2}
        />
      ));

      return (
        <Content
          style={{
            width: width - segmentedWidth,
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
  }, [heights.chartPanelHeight, propertyFilterOptions, width]);

  const handleOnCollapse = useCallback((_collapsed: boolean) => {
    setIsCollapsed(_collapsed);
    setSearchPanelWidth(
      _collapsed ? collapseButtonWidth : defaultSearchPanelWidth,
    );
  }, []);

  const handleOnSelectSort = useCallback(
    (sortValue: ResultTableSortOption) => {
      const _hits = sortHits(hits, sortValue);
      setHits(_hits);
    },
    [hits],
  );

  const handleOnResize = useCallback(
    (_searchPanelWidth: number) => {
      if (!isCollapsed) {
        setSearchPanelWidth(_searchPanelWidth);
      }
    },
    [isCollapsed],
  );

  const searchAndResultPanel = useMemo(() => {
    const searchPanel = (
      <CommonSearchPanel
        items={PropertyFilterOptionsMenuItems({
          propertyFilterOptions,
          showCounts: true,
        })}
        collapsed={isCollapsed}
        onCollapse={handleOnCollapse}
        propertyFilterOptions={propertyFilterOptions}
        onSubmit={handleOnSubmit}
        width={searchPanelWidth}
        height={heights.searchPanelHeight}
        initialValues={{
          ...(JSON.parse(
            JSON.stringify(defaultSearchFieldValues),
          ) as SearchFields),
          propertyFilterOptions,
        }}
      />
    );

    return (
      <SearchAndResultPanel
        searchPanel={searchPanel}
        width={width - segmentedWidth}
        height={heights.searchPanelHeight}
        searchPanelWidth={searchPanelWidth}
        widthOverview={width}
        heightOverview={height}
        hits={hits}
        isRequesting={isSearching}
        onSort={handleOnSelectSort}
        onResize={handleOnResize}
      />
    );
  }, [
    propertyFilterOptions,
    isCollapsed,
    handleOnCollapse,
    handleOnSubmit,
    searchPanelWidth,
    heights.searchPanelHeight,
    width,
    height,
    hits,
    isSearching,
    handleOnSelectSort,
    handleOnResize,
  ]);

  return useMemo(() => {
    const classificationData = buildClassificationData(
      metadata?.compound_class_chemont ?? [],
    );

    const elements = [
      searchAndResultPanel,
      <Content>
        <SectionDivider label="Charts (Selection)" />
        {charts}
      </Content>,
      <Content>
        <SectionDivider label="Classification (ChemOnt)" />
        {classificationData.labels.length > 0 ? (
          <ClassificationPanel
            data={classificationData}
            width={width - segmentedWidth}
            height={heights.classificationPanelHeight}
          />
        ) : (
          <Content
            style={{
              width: width - segmentedWidth,
              height: 50,
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              paddingLeft: 20,
            }}
          >
            <NotAvailableLabel />
          </Content>
        )}
      </Content>,
      <Content>
        <SectionDivider label="Information" />
        <MetadataPanel metadata={metadata} />
      </Content>,
    ];
    const elementLabels = [
      'Filter',
      'Charts',
      'Compound Classes',
      'Information',
    ];

    return (
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
          <Segmented elements={elements} elementLabels={elementLabels} />
        </Content>
      </Layout>
    );
  }, [
    charts,
    heights.classificationPanelHeight,
    isFetchingContent,
    metadata,
    searchAndResultPanel,
    width,
  ]);
}

export default ContentView;
