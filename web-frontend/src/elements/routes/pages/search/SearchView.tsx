import './SearchView.scss';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Peak from '../../../../types/peak/Peak';

import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Hit from '../../../../types/Hit';
import Spinner from '../../../basic/Spinner';
import SearchPanel from './SearchPanel';
import Placeholder from '../../../basic/Placeholder';
import ResultPanel from '../../../result/ResultPanel';
import { FieldValues } from 'react-hook-form';
import fetchData from '../../../../utils/fetchData';
import Content from '../../../../types/Content';
import ValueCount from '../../../../types/ValueCount';
import buildSearchParams from '../../../../utils/buildSearchParams';
import Record from '../../../../types/Record';
import initFlags from '../../../../utils/initFlags';

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
    () => (collapsed ? 50 : width * 0.25),
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

  // const searchHits = useCallback(
  //   async (peakList: Peak[], referenceSpectraList: string[]) => {
  //     const url = import.meta.env.VITE_MB3_API_URL + '/v1/similarity';
  //     const searchParams: SearchParams = {};
  //     searchParams['peak_list'] = peakList.map((p) => `${p.mz};${p.intensity}`);
  //     if (referenceSpectraList.length > 0) {
  //       searchParams['reference_spectra_list'] = referenceSpectraList;
  //     }
  //     return (await fetchData(url, searchParams)).data;
  //   },
  //   [],
  // );

  // const handleOnSearchHits = useCallback(
  //   async (peakList: Peak[], referenceSpectraList: string[]) => {
  //     setIsRequesting(true);
  //     const _hits = await searchHits(peakList, referenceSpectraList);
  //     setReference(peakList);
  //     setHits(_hits || []);
  //     setIsRequesting(false);
  //   },
  //   [searchHits],
  // );

  const handleOnSearchByFilter = useCallback(
    async (msSpecFilterOptions: Content) => {
      setIsRequesting(true);

      const searchParams = buildSearchParams(msSpecFilterOptions);
      const url2 = import.meta.env.VITE_MB3_API_URL + '/v1/records/simple';
      const _records = await fetchData(url2, searchParams);
      const _hits: Hit[] = _records.map((r: Record) => {
        const hit: Hit = {
          accession: r.accession,
          record: r,
        };

        return hit;
      });

      setHits(_hits);

      setIsRequesting(false);
    },
    [],
  );

  const handleOnSubmit = useCallback(
    (data: FieldValues) => {
      console.log(data);

      setCollapsed(true);
      // const peakListValues: number[][] = data.peakListInputField
      //   .split('\n')
      //   .map((line: string) => {
      //     const [mz, intensity] = line.split(' ');
      //     return [parseFloat(mz), parseFloat(intensity)];
      //   });
      // const max = Math.max(...peakListValues.map((p) => p[1]));
      // const peakList: Peak[] = peakListValues.map((values: number[]) => {
      //   const [mz, intensity] = values;
      //   const rel = Math.floor((intensity / max) * 1000) - 1;
      //   return {
      //     mz,
      //     intensity,
      //     rel: rel < 0 ? 0 : rel,
      //     id: generateID(),
      //   } as Peak;
      // });
      // const referenceSpectraList = data.referenceSpectraInputField
      //   .split('\n')
      //   .filter((s: string) => s !== '');

      // handleOnSearchHits(peakList, referenceSpectraList);

      handleOnSearchByFilter(data.msSpecFilterOptions);
    },
    [handleOnSearchByFilter],
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

  const placeholder = useMemo(
    () => (
      <Placeholder
        child={''}
        style={{
          width: width - searchPanelWidth,
          height: height,
        }}
      />
    ),
    [height, searchPanelWidth, width],
  );

  return (
    <div ref={ref} className="search-view">
      {searchPanel}
      {isRequesting ? (
        <Spinner buttonDisabled={true} />
      ) : hits.length > 0 ? (
        resultPanel
      ) : (
        placeholder
      )}
    </div>
  );
}

export default SearchView;
