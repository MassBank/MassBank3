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
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { usePropertiesContext } from '../../../../context/properties/properties';
import sortHits from '../../../../utils/sortHits';
import routes from '../../../../constants/routes';

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
  massSpecFilterOptions: undefined,
  structure: undefined,
};

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
      setMassSpecFilterOptions(_browseContent);

      setIsFetchingContent(false);
    },
    [backendUrl],
  );

  const buildSearchParamsFromFormData = useCallback(
    (formData: SearchFields) => {
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

        if (
          peaksSearchData.massTolerance &&
          peaksSearchData.massTolerance > 0
        ) {
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

      const compoundClass = (
        formData.basicSearchFilterOptions?.compoundClass || ''
      ).trim();
      if (compoundClass.length > 0) {
        builtSearchParams['compound_class'] = [compoundClass];
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

      return builtSearchParams;
    },
    [],
  );

  const buildContentFromSearchParams = useCallback(
    (searchParams: URLSearchParams) => {
      const formData = { ...defaultInitialValues };
      let containsValues = false;

      formData.massSpecFilterOptions = {
        contributor: searchParams.get('contributor')?.split(',') ?? [],
        instrument_type: searchParams.get('instrument_type')?.split(',') ?? [],
        ms_type: searchParams.get('ms_type')?.split(',') ?? [],
        ion_mode: searchParams.get('ion_mode')?.split(',') ?? [],
      };
      containsValues =
        formData.massSpecFilterOptions.contributor.length > 0 ||
        formData.massSpecFilterOptions.instrument_type.length > 0 ||
        formData.massSpecFilterOptions.ms_type.length > 0 ||
        formData.massSpecFilterOptions.ion_mode.length > 0;

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
        if (formData.peaks) {
          formData.peaks.similarity = {
            peakList: peak_list_text,
            threshold: peak_list_threshold,
          };
        }
        containsValues = true;
      } else {
        if (formData.peaks) {
          formData.peaks.similarity = {
            peakList: undefined,
            threshold: defaultSimilarityThreshold,
          };
        }
      }

      const compound_name = searchParams.get('compound_name');
      if (compound_name) {
        formData.basicSearchFilterOptions.compoundName = compound_name;
        containsValues = true;
      } else {
        if (formData.basicSearchFilterOptions) {
          formData.basicSearchFilterOptions.compoundName = undefined;
        }
      }

      const compound_class = searchParams.get('compound_class');
      if (compound_class) {
        formData.basicSearchFilterOptions.compoundClass = compound_class;
        containsValues = true;
      } else {
        if (formData.basicSearchFilterOptions) {
          formData.basicSearchFilterOptions.compoundClass = undefined;
        }
      }

      const formula = searchParams.get('formula');
      if (formula) {
        formData.basicSearchFilterOptions.formula = formula;
        containsValues = true;
      } else {
        if (formData.basicSearchFilterOptions) {
          formData.basicSearchFilterOptions.formula = undefined;
        }
      }

      const exact_mass = searchParams.get('exact_mass');
      if (exact_mass) {
        formData.basicSearchFilterOptions.exactMass = Number(exact_mass);
        containsValues = true;
      } else {
        if (formData.basicSearchFilterOptions) {
          formData.basicSearchFilterOptions.exactMass = undefined;
        }
      }

      const inchi = searchParams.get('inchi');
      if (inchi) {
        formData.inchi = inchi;
        containsValues = true;
      } else {
        if (formData.inchi) {
          formData.inchi = undefined;
        }
      }

      const splash = searchParams.get('splash');
      if (splash) {
        formData.splash = splash;
        containsValues = true;
      } else {
        if (formData.splash) {
          formData.splash = undefined;
        }
      }

      const substructure = searchParams.get('substructure');
      if (substructure) {
        formData.structure = substructure;
        containsValues = true;
      } else {
        if (formData.structure) {
          formData.structure = undefined;
        }
      }

      return { formData, containsValues };
    },
    [],
  );

  const handleOnSearch = useCallback(
    async (formData: SearchFields) => {
      setIsSearching(true);

      const builtSearchParams = buildSearchParamsFromFormData(formData);

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

      const smiles = formData.structure;
      if (smiles && smiles.trim().length > 0) {
        _hits = sortHits(_hits, 'atom_count');
      }

      setHits(_hits);
      setIsSearching(false);
    },
    [backendUrl, buildSearchParamsFromFormData],
  );

  const handleOnSubmit = useCallback(
    async (formData: SearchFields, clicked: boolean) => {
      // setIsCollapsed(true);

      if (clicked) {
        let builtSearchParams = buildSearchParamsFromFormData(formData);
        if (Object.keys(builtSearchParams).length === 0) {
          builtSearchParams = buildSearchParamsFromFormData(
            buildContentFromSearchParams(searchParams).formData,
          );
        }
        navigate({
          pathname: baseUrl + routes.search.path,
          search: `?${Object.keys(builtSearchParams).length > 0 ? createSearchParams(builtSearchParams) : createSearchParams({ plain: 'true' })}`,
        });
      } else {
        const formDataContent = massSpecFilterOptionsFormDataToContentMapper(
          formData?.massSpecFilterOptions,
          undefined,
        );

        await handleOnFetchContent(formDataContent);
        setInitialValues(formData);
        await handleOnSearch(formData);
      }
    },
    [
      buildSearchParamsFromFormData,
      navigate,
      baseUrl,
      buildContentFromSearchParams,
      searchParams,
      handleOnFetchContent,
      handleOnSearch,
    ],
  );

  useEffect(() => {
    const plainQuery = searchParams.get('plain');
    const { formData, containsValues } =
      buildContentFromSearchParams(searchParams);
    const _initialValues = { ...defaultInitialValues, ...formData };
    const runSubmit = plainQuery === 'true' || containsValues;

    if (runSubmit) {
      handleOnSubmit(_initialValues, false);
    } else {
      handleOnFetchContent(undefined);
      setInitialValues(_initialValues);
      setHits([]);
    }
  }, [
    buildContentFromSearchParams,
    handleOnFetchContent,
    handleOnSearch,
    handleOnSubmit,
    searchParams,
  ]);

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
