import './SearchView.scss';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Peak from '../../../../types/peak/Peak';

import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Hit from '../../../../types/Hit';
import CommonSearchPanel from '../../../common/CommonSearchPanel';
import fetchData from '../../../../utils/fetchData';
import buildSearchParams from '../../../../utils/buildSearchParams';
import initFlags from '../../../../utils/initFlags';
import SearchResult from '../../../../types/SearchResult';
import parsePeakListInputField from './searchPanel/utils/parsePeakListAndReferences';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Layout, Spin } from 'antd';
import massSpecFilterOptionsFormDataToContentMapper from '../../../../utils/massSpecFilterOptionsFormDataToContentMapper';
import SearchAndResultPanel from '../../../common/SearchAndResultPanel';
import { Content } from 'antd/es/layout/layout';
import SearchPanelMenuItems from './SearchPanelMenuItems';

const initialValues: SearchFields = {
  basicSearchFilterOptions: {
    compoundName: undefined,
    formula: undefined,
    exactMass: undefined,
    massTolerance: 0.1,
  },
  peaks: {
    similarity: {
      peakList: undefined,
      threshold: 0.8,
    },
    peaks: {
      peaks: [],
      massTolerance: 0.1,
      intensity: 50,
    },
  },
  inchi: undefined,
  splash: undefined,
  // massSpecFilterOptions,
  structure: undefined,
};

function SearchView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);

  const [reference, setReference] = useState<Peak[]>([]);
  const [isFetchingContent, setIsFetchingContent] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [massSpecFilterOptions, setMassSpecFilterOptions] = useState<
    ContentFilterOptions | undefined
  >();

  const searchPanelWidth = useMemo(
    () => (isCollapsed ? 50 : Math.max(width * 0.3, 500)),
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

  useEffect(() => {
    handleOnFetchContent(undefined);
  }, [handleOnFetchContent]);

  const handleOnSearch = useCallback(async (formData: SearchFields) => {
    setIsSearching(true);

    const formData_content = massSpecFilterOptionsFormDataToContentMapper(
      formData.massSpecFilterOptions,
      undefined,
    );
    const searchParams = buildSearchParams(formData_content);

    const similarityPeakListInputFieldData = (
      formData.peaks?.similarity?.peakList || ''
    ).trim();

    if (similarityPeakListInputFieldData.length > 0) {
      const peakList = parsePeakListInputField(
        similarityPeakListInputFieldData,
      );
      searchParams['peak_list'] = [
        peakList.map((p) => `${p.mz};${p.intensity}`).join(','),
      ];
      const peakListThreshold = formData.peaks?.similarity?.threshold || 0;
      searchParams['peak_list_threshold'] = [String(peakListThreshold)];
      setReference(peakList);
    } else {
      setReference([]);
    }

    const peaksSearchData = formData.peaks?.peaks || {
      peaks: [],
      massTolerance: 0,
      intensity: 0,
    };
    const peaks = (peaksSearchData.peaks ?? []).map((p) => p.mz);
    if (peaks.length > 0) {
      searchParams['peaks'] = [peaks.join(',')];

      if (peaksSearchData.massTolerance && peaksSearchData.massTolerance > 0) {
        searchParams['mass_tolerance'] = [
          String(peaksSearchData.massTolerance),
        ];
      }
      if (peaksSearchData.intensity && peaksSearchData.intensity > 0) {
        searchParams['intensity'] = [String(peaksSearchData.intensity)];
      }
    }

    const inchi = (formData.inchi || '').trim();
    if (inchi.length > 0) {
      if (inchi.startsWith('InChI=')) {
        searchParams['inchi'] = [inchi];
      } else {
        searchParams['inchi_key'] = [inchi];
      }
    }
    const splash = (formData.splash || '').trim();
    if (splash.length > 0) {
      searchParams['splash'] = [splash];
    }

    const compoundName = (
      formData.basicSearchFilterOptions?.compoundName || ''
    ).trim();
    if (compoundName.length > 0) {
      searchParams['compound_name'] = [compoundName];
    }
    const formula = (formData.basicSearchFilterOptions?.formula || '').trim();
    if (formula.length > 0) {
      searchParams['formula'] = [formula];
    }
    const exactMass = formData.basicSearchFilterOptions?.exactMass || 0;
    if (exactMass > 0) {
      searchParams['exact_mass'] = [String(exactMass)];

      const massTolerance =
        formData.basicSearchFilterOptions.massTolerance || 0;
      if (exactMass > 0) {
        searchParams['mass_tolerance'] = [String(massTolerance)];
      } else {
        searchParams['mass_tolerance'] = ['0.0'];
      }
    }

    const smiles = formData.structure;
    if (smiles && smiles.trim().length > 0) {
      searchParams['substructure'] = [smiles];
    }
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
  }, []);

  const handleOnSubmit = useCallback(
    async (formData: SearchFields) => {
      setIsCollapsed(true);

      const formDataContent = massSpecFilterOptionsFormDataToContentMapper(
        formData?.massSpecFilterOptions,
        // massSpecFilterOptions,
        undefined,
      );

      await handleOnSearch(formData);
      await handleOnFetchContent(formDataContent);
    },
    [handleOnSearch, handleOnFetchContent],
  );

  const searchAndResultPanel = useMemo(() => {
    const searchPanel = (
      <CommonSearchPanel
        items={SearchPanelMenuItems({
          massSpecFilterOptions,
          width,
        })}
        initialValues={initialValues}
        width={searchPanelWidth}
        height={height}
        collapsed={isCollapsed}
        massSpecFilterOptions={massSpecFilterOptions}
        onCollapse={(collapsed: boolean) => setIsCollapsed(collapsed)}
        onSubmit={handleOnSubmit}
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
    massSpecFilterOptions,
    width,
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
    [isFetchingContent, searchAndResultPanel],
  );
}

export default SearchView;
