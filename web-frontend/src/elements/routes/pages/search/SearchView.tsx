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
import parsePeakListInputField from './searchPanel/utils/parsePeakListAndReferences';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Layout, Spin } from 'antd';
import massSpecFilterOptionsFormDataToContentMapper from '../../../../utils/massSpecFilterOptionsFormDataToContentMapper';
import SearchAndResultPanel from '../../../common/SearchAndResultPanel';
import { Content } from 'antd/es/layout/layout';
import SearchPanelMenuItems from './SearchPanelMenuItems';
import { useLocation, useSearchParams } from 'react-router-dom';

const defaultMassTolerance = 0.1;
const defaultSimilarityThreshold = 0.8;
const defaultPeakIntensity = 50;

const defaultInitialValues: SearchFields = {
  basicSearchFilterOptions: {
    compoundName: undefined,
    formula: undefined,
    exactMass: undefined,
    massTolerance: defaultMassTolerance,
  },
  peaks: {
    similarity: {
      peakList: undefined,
      threshold: defaultSimilarityThreshold,
    },
    peaks: {
      peaks: [],
      massTolerance: defaultMassTolerance,
      intensity: defaultPeakIntensity,
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
  const location = useLocation();

  const [reference, setReference] = useState<Peak[]>([]);
  const [isFetchingContent, setIsFetchingContent] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [massSpecFilterOptions, setMassSpecFilterOptions] = useState<
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
        const url = process.env.REACT_APP_MB3_API_URL + '/v1/filter/browse';
        _browseContent = (await fetchData(url)) as ContentFilterOptions;
      } else {
        const builtSearchParams = buildSearchParams(_browseContent);
        const url = process.env.REACT_APP_MB3_API_URL + '/v1/filter/browse';
        _browseContent = (await fetchData(
          url,
          builtSearchParams,
        )) as ContentFilterOptions;
      }
      initFlags(_browseContent);
      setMassSpecFilterOptions(_browseContent);

      setIsFetchingContent(false);
    },
    [],
  );

  const handleOnSearch = useCallback(async (formData: SearchFields) => {
    setIsSearching(true);

    const formData_content = massSpecFilterOptionsFormDataToContentMapper(
      formData.massSpecFilterOptions,
      undefined,
    );
    const builtSearchParams = buildSearchParams(formData_content);

    const similarityPeakListInputFieldData = (
      formData.peaks?.similarity?.peakList || ''
    ).trim();

    if (similarityPeakListInputFieldData.length > 0) {
      const peakList = parsePeakListInputField(
        similarityPeakListInputFieldData,
      );
      builtSearchParams['peak_list'] = [
        peakList.map((p) => `${p.mz};${p.intensity}`).join(','),
      ];
      const peakListThreshold = formData.peaks?.similarity?.threshold || 0;
      builtSearchParams['peak_list_threshold'] = [String(peakListThreshold)];
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
      builtSearchParams['peaks'] = [peaks.join(',')];

      if (peaksSearchData.massTolerance && peaksSearchData.massTolerance > 0) {
        builtSearchParams['mass_tolerance'] = [
          String(peaksSearchData.massTolerance),
        ];
      }
      if (peaksSearchData.intensity && peaksSearchData.intensity > 0) {
        builtSearchParams['intensity'] = [String(peaksSearchData.intensity)];
      }
    }

    const inchi = (formData.inchi || '').trim();
    if (inchi.length > 0) {
      if (inchi.startsWith('InChI=')) {
        builtSearchParams['inchi'] = [inchi];
      } else {
        builtSearchParams['inchi_key'] = [inchi];
      }
    }
    const splash = (formData.splash || '').trim();
    if (splash.length > 0) {
      builtSearchParams['splash'] = [splash];
    }

    const compoundName = (
      formData.basicSearchFilterOptions?.compoundName || ''
    ).trim();
    if (compoundName.length > 0) {
      builtSearchParams['compound_name'] = [compoundName];
    }
    const formula = (formData.basicSearchFilterOptions?.formula || '').trim();
    if (formula.length > 0) {
      builtSearchParams['formula'] = [formula];
    }
    const exactMass = formData.basicSearchFilterOptions?.exactMass || 0;
    if (exactMass > 0) {
      builtSearchParams['exact_mass'] = [String(exactMass)];

      const massTolerance =
        formData.basicSearchFilterOptions.massTolerance || 0;
      if (exactMass > 0) {
        builtSearchParams['mass_tolerance'] = [String(massTolerance)];
      } else {
        builtSearchParams['mass_tolerance'] = ['0.0'];
      }
    }

    const smiles = formData.structure;
    if (smiles && smiles.trim().length > 0) {
      builtSearchParams['substructure'] = [smiles];
    }
    const url = process.env.REACT_APP_MB3_API_URL + '/v1/records/search';
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

    setHits(_hits);
    setIsSearching(false);
  }, []);

  const handleOnSubmit = useCallback(
    async (formData: SearchFields) => {
      // setIsCollapsed(true);

      const formDataContent = massSpecFilterOptionsFormDataToContentMapper(
        formData?.massSpecFilterOptions,
        // massSpecFilterOptions,
        undefined,
      );

      setInitialValues(formData);
      await handleOnSearch(formData);
      await handleOnFetchContent(formDataContent);
    },
    [handleOnSearch, handleOnFetchContent],
  );

  useEffect(() => {
    handleOnFetchContent(undefined);

    const _initialValues = { ...defaultInitialValues };

    let runSubmit = false;
    const similarityPeakList = searchParams.get('peak_list');
    if (similarityPeakList) {
      const peak_list_text = similarityPeakList
        .split(',')
        .map((p) => {
          const split = p.split(';');
          return split.join(' ');
        })
        .join('\n');
      const similarityPeakListThreshold = searchParams.get(
        'peak_list_threshold',
      );
      const peak_list_threshold =
        similarityPeakListThreshold !== undefined
          ? Number(similarityPeakListThreshold)
          : (defaultInitialValues.peaks?.similarity?.threshold ??
            defaultSimilarityThreshold);
      if (_initialValues.peaks) {
        _initialValues.peaks.similarity = {
          peakList: peak_list_text,
          threshold: peak_list_threshold,
        };
      }
      runSubmit = true;
    } else {
      if (_initialValues.peaks) {
        _initialValues.peaks.similarity = {
          peakList: undefined,
          threshold: defaultSimilarityThreshold,
        };
      }
    }

    const compound_name = searchParams.get('compound_name');
    if (compound_name) {
      _initialValues.basicSearchFilterOptions.compoundName = compound_name;
      runSubmit = true;
    } else {
      if (_initialValues.basicSearchFilterOptions) {
        _initialValues.basicSearchFilterOptions.compoundName = undefined;
      }
    }

    const formula = searchParams.get('formula');
    if (formula) {
      _initialValues.basicSearchFilterOptions.formula = formula;
      runSubmit = true;
    } else {
      if (_initialValues.basicSearchFilterOptions) {
        _initialValues.basicSearchFilterOptions.formula = undefined;
      }
    }

    const exact_mass = searchParams.get('exact_mass');
    if (exact_mass) {
      _initialValues.basicSearchFilterOptions.exactMass = Number(exact_mass);
      runSubmit = true;
    } else {
      if (_initialValues.basicSearchFilterOptions) {
        _initialValues.basicSearchFilterOptions.exactMass = undefined;
      }
    }

    const inchi = searchParams.get('inchi');
    if (inchi) {
      _initialValues.inchi = inchi;
      runSubmit = true;
    } else {
      if (_initialValues.inchi) {
        _initialValues.inchi = undefined;
      }
    }

    const splash = searchParams.get('splash');
    if (splash) {
      _initialValues.splash = splash;
      runSubmit = true;
    } else {
      if (_initialValues.splash) {
        _initialValues.splash = undefined;
      }
    }

    const substructure = searchParams.get('substructure');
    if (substructure) {
      _initialValues.structure = substructure;
      runSubmit = true;
    } else {
      if (_initialValues.structure) {
        _initialValues.structure = undefined;
      }
    }

    setInitialValues(_initialValues);

    if (runSubmit) {
      handleOnSubmit(_initialValues);
    } else {
      setHits([]);
    }
  }, [handleOnFetchContent, handleOnSearch, handleOnSubmit, searchParams]);

  const searchAndResultPanel = useMemo(() => {
    const searchPanel = (
      <CommonSearchPanel
        items={SearchPanelMenuItems({
          massSpecFilterOptions,
          initialStructure: initialValues?.structure ?? '',
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
