import './SearchView.scss';

import { useCallback, useMemo, useRef, useState } from 'react';
import Peak from '../../../../types/peak/Peak';
import generateID from '../../../../utils/generateID';

import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Hit from '../../../../types/Hit';
import Spinner from '../../../basic/Spinner';
import axios from 'axios';
import SearchPanel from './SearchPanel';
import Placeholder from '../../../basic/Placeholder';
import ResultPanel from '../../../result/ResultPanel';
import { FieldValues } from 'react-hook-form';

function SearchView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [reference, setReference] = useState<Peak[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const searchPanelWidth = useMemo(
    () => (collapsed ? 50 : width * 0.25),
    [collapsed, width],
  );
  const searchPanelHeight = height;

  const searchHits = useCallback(
    async (peakList: Peak[], referenceSpectraList: string[]) => {
      const url = import.meta.env.VITE_MB3_API_URL + '/v1/similarity';
      const params = new URLSearchParams();
      params.append(
        'peak_list',
        peakList.map((p) => `${p.mz};${p.intensity}`).join(','),
      );
      params.append('reference_spectra_list', referenceSpectraList.join(','));

      const resp = await axios.get(url, { params });
      if (resp.status === 200) {
        const data = await resp.data;
        if (typeof data === 'string') {
          return undefined;
        }

        return data.data as Hit[];
      }

      return undefined;
    },
    [],
  );

  const handleOnSearchHits = useCallback(
    async (peakList: Peak[], referenceSpectraList: string[]) => {
      setIsRequesting(true);
      const _hits = await searchHits(peakList, referenceSpectraList);
      setReference(peakList);
      setHits(_hits || []);
      setIsRequesting(false);
    },
    [searchHits],
  );

  const handleOnSubmit = useCallback(
    (data: FieldValues) => {
      setCollapsed(true);
      const peakListValues: number[][] = data.peakListInputField
        .split('\n')
        .map((line: string) => {
          const [mz, intensity] = line.split(' ');
          return [parseFloat(mz), parseFloat(intensity)];
        });
      const max = Math.max(...peakListValues.map((p) => p[1]));
      const peakList: Peak[] = peakListValues.map((values: number[]) => {
        const [mz, intensity] = values;
        const rel = Math.floor((intensity / max) * 1000) - 1;
        return {
          mz,
          intensity,
          rel: rel < 0 ? 0 : rel,
          id: generateID(),
        } as Peak;
      });
      const referenceSpectraList = data.referenceSpectraInputField
        .split('\n')
        .filter((s: string) => s !== '');

      handleOnSearchHits(peakList, referenceSpectraList);
    },
    [handleOnSearchHits],
  );

  const searchPanel = useMemo(
    () => (
      <SearchPanel
        width={searchPanelWidth}
        height={searchPanelHeight}
        collapsed={collapsed}
        onCollapse={(collapsed: boolean) => setCollapsed(collapsed)}
        onSubmit={handleOnSubmit}
      />
    ),
    [searchPanelWidth, searchPanelHeight, collapsed, handleOnSubmit],
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
