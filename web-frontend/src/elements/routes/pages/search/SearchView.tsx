import './SearchView.scss';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Peak from '../../../../types/peak/Peak';

import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Hit from '../../../../types/Hit';
import Spinner from '../../../basic/Spinner';
import SearchPanel from './searchPanel/SearchPanel';
import Placeholder from '../../../basic/Placeholder';
import ResultPanel from '../../../result/ResultPanel';
import { FieldValues } from 'react-hook-form';
import fetchData from '../../../../utils/fetchData';
import Content from '../../../../types/Content';
import buildSearchParams from '../../../../utils/buildSearchParams';
import initFlags from '../../../../utils/initFlags';
import axios from 'axios';
import SearchResult from '../../../../types/SearchResult';
import SearchResultData from '../../../../types/SearchResultData';
import BasicSearchFilterOptions from '../../../../types/filterOptions/basicSearchFilterOptions';
import parsePeakListInputField from './searchPanel/utils/parsePeakListAndReferences';
import { Molecule } from 'openchemlib';

function SearchView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [reference, setReference] = useState<Peak[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);
  const [msSpecFilterOptions, setMsSpectFilterOptions] = useState<
    Content | undefined
  >();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const searchPanelWidth = useMemo(
    () => (collapsed ? 50 : width * 0.4),
    [collapsed, width],
  );
  const searchPanelHeight = height;

  const handleOnFetchContent = useCallback(async () => {
    setIsRequesting(true);

    const url = import.meta.env.VITE_MB3_API_URL + '/v1/filter/browse';
    const browseContent = (await fetchData(url)) as Content;

    initFlags(browseContent);
    setMsSpectFilterOptions(browseContent);
    setIsRequesting(false);
  }, []);

  useEffect(() => {
    handleOnFetchContent();
  }, [handleOnFetchContent]);

  const handleOnSearch = useCallback(async (formData: FieldValues) => {
    const _msSpecFilterOptions = formData['msSpecFilterOptions'] as Content;
    const searchParams = buildSearchParams(_msSpecFilterOptions);

    const similarityPeakListInputFieldData =
      formData['similarity']['peakListInputField'];
    if (similarityPeakListInputFieldData.trim().length > 0) {
      const peakList = parsePeakListInputField(
        similarityPeakListInputFieldData,
      );
      searchParams['peak_list'] = [
        peakList.map((p) => `${p.mz};${p.intensity}`).join(','),
      ];
      const peakListThreshold =
        formData['similarity']['peakListThresholdInputField'];
      searchParams['peak_list_threshold'] = [peakListThreshold];
      setReference(peakList);
    } else {
      setReference([]);
    }

    const peaksSearchData = formData['peakSearch'];
    const peaks = Object.keys(peaksSearchData)
      .filter((key) => key.startsWith('p'))
      .map((key) => peaksSearchData[key] as number)
      .filter((p) => !isNaN(p));
    if (peaks.length > 0) {
      searchParams['peaks'] = [peaks.join(',')];

      if (
        !isNaN(peaksSearchData['massTolerance']) &&
        peaksSearchData['massTolerance'] > 0
      ) {
        searchParams['mass_tolerance'] = [peaksSearchData['massTolerance']];
      }
      if (
        !isNaN(peaksSearchData['intensity']) &&
        peaksSearchData['intensity'] > 0
      ) {
        searchParams['intensity'] = [peaksSearchData['intensity']];
      }
    }

    const inchi = (formData['inchiInputField'] as string).trim();
    if (inchi.length > 0) {
      if (inchi.startsWith('InChI=')) {
        searchParams['inchi'] = [inchi];
      } else {
        searchParams['inchi_key'] = [inchi];
      }
    }
    const splash = (formData['splashInputField'] as string).trim();
    if (splash.length > 0) {
      searchParams['splash'] = [splash];
    }

    const _basicSearchFilterOptions = formData[
      'basicSearchFilterOptions'
    ] as BasicSearchFilterOptions;

    const compoundName = _basicSearchFilterOptions.compoundName.trim();
    if (compoundName.length > 0) {
      searchParams['compound_name'] = [compoundName];
    }
    const formula = _basicSearchFilterOptions.formula.trim();
    if (formula.length > 0) {
      searchParams['formula'] = [formula];
    }
    const exactMass = _basicSearchFilterOptions.exactMass;
    if (exactMass > 0) {
      searchParams['exact_mass'] = [String(exactMass)];

      const massTolerance = _basicSearchFilterOptions.massTolerance;
      if (exactMass > 0) {
        searchParams['mass_tolerance'] = [String(massTolerance)];
      } else {
        searchParams['mass_tolerance'] = ['0.0'];
      }
    }

    const molfile = formData['structureInputField'] as string;
    if (molfile && molfile.trim().length > 0) {
      const mol = Molecule.fromMolfile(molfile);
      const smiles = mol.toSmiles();
      searchParams['substructure'] = [smiles];
    }

    console.log(searchParams);

    const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/search';
    console.log(axios.getUri({ url, params: searchParams }));
    const searchResult = (await fetchData(url, searchParams)) as SearchResult;
    console.log(searchResult);

    const _hits: Hit[] = searchResult.data
      ? searchResult.data.map((d: SearchResultData) => {
          const hit: Hit = {
            record: d.record,
            accession: d.record.accession,
            score: d.score,
          };

          return hit;
        })
      : [];

    setHits(_hits);

    setIsRequesting(false);
  }, []);

  const handleOnSubmit = useCallback(
    async (data: FieldValues) => {
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
        msSpecFilterOptions={msSpecFilterOptions}
        onCollapse={(collapsed: boolean) => setCollapsed(collapsed)}
        onSubmit={handleOnSubmit}
      />
    ),
    [
      searchPanelWidth,
      searchPanelHeight,
      collapsed,
      msSpecFilterOptions,
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
        widthOverview={width}
        heightOverview={height - 100}
      />
    ),
    [height, hits, reference, searchPanelWidth, width],
  );

  return (
    <div ref={ref} className="search-view">
      {searchPanel}
      {isRequesting ? (
        <Spinner buttonDisabled={true} />
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
    </div>
  );
}

export default SearchView;
