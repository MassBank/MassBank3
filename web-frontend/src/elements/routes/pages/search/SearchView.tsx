import './SearchView.scss';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Peak from '../../../../types/peak/Peak';

import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Hit from '../../../../types/Hit';
import CommonSearchPanel from '../../../common/CommonSearchPanel';
import fetchData from '../../../../utils/request/fetchData';
import buildSearchParams from '../../../../utils/request/buildSearchParams';
import initFlags from '../../../../utils/initFlags';
import SearchResult from '../../../../types/SearchResult';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Layout, Spin } from 'antd';
import propertyFilterOptionsFormDataToContentMapper from '../../../../utils/propertyFilterOptionsFormDataToContentMapper';
import SearchAndResultPanel from '../../../common/SearchAndResultPanel';
import { Content } from 'antd/es/layout/layout';
import SearchPanelMenuItems from './SearchPanelMenuItems';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { usePropertiesContext } from '../../../../context/properties/properties';
import sortHits from '../../../../utils/sortHits';
import routes from '../../../../constants/routes';
import buildFormDataFromSearchParams from '../../../../utils/buildFormDataFromSearchParams';
import buildSearchParamsFromFormData from '../../../../utils/buildSearchParamsFromFormData';
import parsePeakListInputField from '../../../../utils/parsePeakListAndReferences';
import defaultSearchFieldValues from '../../../../constants/defaultSearchFieldValues';

function SearchView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const location = useLocation();
  const { backendUrl, baseUrl } = usePropertiesContext();
  const navigate = useNavigate();

  const [reference, setReference] = useState<Peak[]>([]);
  const [isFetchingContent, setIsFetchingContent] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [propertyFilterOptions, setPropertyFilterOptions] = useState<
    ContentFilterOptions | undefined
  >();
  const [searchParams] = useSearchParams();
  const [initialValues, setInitialValues] = useState<
    SearchFields | undefined
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
        const url = backendUrl + '/v1/filter/browse';
        _browseContent = (await fetchData(url)) as ContentFilterOptions;
      } else {
        const builtSearchParams = buildSearchParams(_browseContent);
        const url = backendUrl + '/v1/filter/browse';
        _browseContent = (await fetchData(
          url,
          builtSearchParams,
        )) as ContentFilterOptions;
      }
      initFlags(_browseContent);
      setPropertyFilterOptions(_browseContent);

      setIsFetchingContent(false);
    },
    [backendUrl],
  );

  const handleOnSearch = useCallback(
    async (formData: SearchFields) => {
      setIsSearching(true);

      const builtSearchParams = buildSearchParamsFromFormData(formData);

      const similarityPeakListInputFieldData = (
        formData.spectralSearchFilterOptions?.similarity?.peakList ?? ''
      ).trim();
      if (similarityPeakListInputFieldData.length > 0) {
        const peakList = parsePeakListInputField(
          similarityPeakListInputFieldData,
        );
        setReference(peakList ?? []);
      } else {
        setReference([]);
      }

      const url = backendUrl + '/v1/records/search';
      const searchResult = (await fetchData(
        url,
        builtSearchParams,
      )) as SearchResult;

      let _hits: Hit[] = searchResult.data ? (searchResult.data as Hit[]) : [];
      _hits = _hits.map((hit, i) => {
        return {
          ...hit,
          index: i,
        };
      });

      const smiles = formData.compoundSearchFilterOptions?.structure;
      if (smiles && smiles.trim().length > 0) {
        _hits = sortHits(_hits, 'atom_count');
      }

      setHits(_hits);
      setIsSearching(false);
    },
    [backendUrl],
  );

  const handleOnSubmit = useCallback(
    async (formData: SearchFields, clicked: boolean) => {
      // setIsCollapsed(true);

      if (clicked) {
        let builtSearchParams = buildSearchParamsFromFormData(formData);
        if (Object.keys(builtSearchParams).length === 0) {
          builtSearchParams = buildSearchParamsFromFormData(
            buildFormDataFromSearchParams(searchParams).formData,
          );
        }
        navigate({
          pathname: baseUrl + routes.search.path,
          search: `?${Object.keys(builtSearchParams).length > 0 ? createSearchParams(builtSearchParams) : createSearchParams({ plain: 'true' })}`,
        });
      } else {
        const formDataContent = propertyFilterOptionsFormDataToContentMapper(
          formData?.propertyFilterOptions,
          undefined,
        );

        await handleOnFetchContent(formDataContent);
        setInitialValues(formData);
        await handleOnSearch(formData);
      }
    },
    [navigate, baseUrl, searchParams, handleOnFetchContent, handleOnSearch],
  );

  useEffect(() => {
    const plainQuery = searchParams.get('plain');
    const { formData, containsValues } =
      buildFormDataFromSearchParams(searchParams);
    const _initialValues = { ...defaultSearchFieldValues, ...formData };
    const runSubmit = plainQuery === 'true' || containsValues;

    if (runSubmit) {
      handleOnSubmit(_initialValues, false);
    } else {
      handleOnFetchContent(undefined);
      setInitialValues(_initialValues);
      setHits([]);
    }
  }, [handleOnFetchContent, handleOnSearch, handleOnSubmit, searchParams]);

  const searchAndResultPanel = useMemo(() => {
    const searchPanel = (
      <CommonSearchPanel
        items={SearchPanelMenuItems({
          propertyFilterOptions,
          initialStructure:
            initialValues?.compoundSearchFilterOptions?.structure ?? '',
          width,
        })}
        initialValues={initialValues ?? defaultSearchFieldValues}
        width={searchPanelWidth}
        height={height}
        collapsed={isCollapsed}
        propertyFilterOptions={propertyFilterOptions}
        onCollapse={(collapsed: boolean) => setIsCollapsed(collapsed)}
        onSubmit={(formData: SearchFields) => handleOnSubmit(formData, true)}
      />
    );

    return (
      <SearchAndResultPanel
        searchPanel={searchPanel}
        width={width}
        height={height}
        searchPanelWidth={searchPanelWidth}
        searchPanelHeight={height}
        widthOverview={width}
        heightOverview={height}
        reference={reference}
        hits={hits}
        isRequesting={isSearching}
      />
    );
  }, [
    propertyFilterOptions,
    width,
    initialValues,
    searchPanelWidth,
    height,
    isCollapsed,
    handleOnSubmit,
    reference,
    hits,
    isSearching,
  ]);

  return useMemo(
    () => (
      <Layout
        key={location.key}
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
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {searchAndResultPanel}
        </Content>
      </Layout>
    ),
    [isFetchingContent, location.key, searchAndResultPanel],
  );
}

export default SearchView;
