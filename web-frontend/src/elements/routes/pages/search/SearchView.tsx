import './SearchView.scss';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Peak from '../../../../types/peak/Peak';

import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Hit from '../../../../types/Hit';
import SearchPanel from './searchPanel/SearchPanel';
import Placeholder from '../../../basic/Placeholder';
import ResultPanel from '../../../result/ResultPanel';
import fetchData from '../../../../utils/fetchData';
import buildSearchParams from '../../../../utils/buildSearchParams';
import initFlags from '../../../../utils/initFlags';
import SearchResult from '../../../../types/SearchResult';
import parsePeakListInputField from './searchPanel/utils/parsePeakListAndReferences';
import { Molecule } from 'openchemlib';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Content } from 'antd/es/layout/layout';
import { Layout, Spin } from 'antd';
import Sider from 'antd/es/layout/Sider';
import ValueCount from '../../../../types/ValueCount';

function SearchView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [reference, setReference] = useState<Peak[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);
  const [massSpecFilterOptions, setMassSpecFilterOptions] = useState<
    ContentFilterOptions | undefined
  >();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const searchPanelWidth = useMemo(
    () => (collapsed ? 50 : Math.max(width * 0.3, 500)),
    [collapsed, width],
  );
  const searchPanelHeight = height;

  const handleOnFetchContent = useCallback(async () => {
    setIsRequesting(true);

    const url = import.meta.env.VITE_MB3_API_URL + '/v1/filter/browse';
    const browseContent = (await fetchData(url)) as ContentFilterOptions;

    initFlags(browseContent);
    setMassSpecFilterOptions(browseContent);
    setIsRequesting(false);
  }, []);

  useEffect(() => {
    handleOnFetchContent();
  }, [handleOnFetchContent]);

  const handleOnSearch = useCallback(async (formData: SearchFields) => {
    console.log('formData', formData);

    const mapper = (data: string[]) => {
      return (data || []).map((value) => ({ value }) as ValueCount);
    };
    const formData_massSpecFilterOptions = {
      contributor: mapper(formData.massSpecFilterOptions?.contributor || []),
      instrument_type: mapper(
        formData.massSpecFilterOptions?.instrument_type || [],
      ),
      ms_type: mapper(formData.massSpecFilterOptions?.ms_type || []),
      ion_mode: mapper(formData.massSpecFilterOptions?.ion_mode || []),
    } as ContentFilterOptions;
    const searchParams = buildSearchParams(formData_massSpecFilterOptions);

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

    const molfile = formData.structure;
    if (molfile && molfile.trim().length > 0) {
      const mol = Molecule.fromMolfile(molfile);
      const smiles = mol.toSmiles();
      searchParams['substructure'] = [smiles];
    }
    const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/search';
    const searchResult = (await fetchData(url, searchParams)) as SearchResult;

    const _hits: Hit[] = searchResult.data ? (searchResult.data as Hit[]) : [];
    setHits(_hits);

    setIsRequesting(false);
  }, []);

  const handleOnSubmit = useCallback(
    async (data: SearchFields) => {
      setIsRequesting(true);
      setCollapsed(true);

      await handleOnSearch(data);
    },
    [handleOnSearch],
  );

  const searchPanel = useMemo(
    () => (
      <SearchPanel
        width={searchPanelWidth}
        height={searchPanelHeight}
        collapsed={collapsed}
        massSpecFilterOptions={massSpecFilterOptions}
        onCollapse={(collapsed: boolean) => setCollapsed(collapsed)}
        onSubmit={handleOnSubmit}
      />
    ),
    [
      searchPanelWidth,
      searchPanelHeight,
      collapsed,
      massSpecFilterOptions,
      handleOnSubmit,
    ],
  );

  const resultPanel = useMemo(
    () => (
      <ResultPanel
        hits={hits}
        reference={reference}
        width={width - searchPanelWidth}
        height={height}
        widthOverview={width * 0.9}
        heightOverview={height * 0.9}
      />
    ),
    [height, hits, reference, searchPanelWidth, width],
  );

  return useMemo(
    () => (
      <Layout ref={ref} style={{ width: '100%', height: '100%' }}>
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Sider
            style={{
              height: searchPanelHeight,
            }}
            width={searchPanelWidth}
          >
            {searchPanel}
          </Sider>
          <Content
            style={{
              width: width - searchPanelWidth,
              height,
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
                  width: width - searchPanelWidth,
                  height: height,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
              />
            )}
          </Content>
        </Content>
      </Layout>
    ),
    [
      collapsed,
      height,
      hits.length,
      isRequesting,
      resultPanel,
      searchPanel,
      searchPanelHeight,
      searchPanelWidth,
      width,
    ],
  );
}

export default SearchView;
