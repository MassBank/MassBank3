import './SearchView.scss';

import { useCallback, useMemo, useRef, useState } from 'react';
import Peak from '../../../../types/peak/Peak';
import generateID from '../../../../utils/generateID';

import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Hit from '../../../../types/Hit';
import SpectralHitsView from './SpectralHitsView';
import Spinner from '../../../basic/Spinner';
import axios from 'axios';
import Record from '../../../../types/Record';
import SearchPanel from './SearchPanel';
import Placeholder from '../../../basic/Placeholder';

function SearchView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const [referencePeakList, setReferencePeakList] = useState<Peak[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);

  const searchPanelWidth = width;
  const searchPanelHeight = 400;

  const searchHits = useCallback(
    async (peakList: Peak[], referenceSpectraList: string[]) => {
      const url = import.meta.env.VITE_MB3_API_URL + '/v1/similarity';
      const params = new URLSearchParams();
      params.append(
        'peak_list',
        peakList.map((p) => `${p.mz};${p.intensity}`).join(','),
      );
      params.append('reference_spectra_list', referenceSpectraList.join(','));
      params.append('limit', '10');

      const resp = await axios.get(url, { params });
      if (resp.status === 200) {
        const data = await resp.data;
        if (typeof data === 'string') {
          return undefined;
        }
        const _hits = data.data;
        const res2 = await fetchRecords(_hits.map((h: Hit) => h.accession));
        for (let i = 0; i < _hits.length; i++) {
          _hits[i].record = res2[i];
        }

        return _hits;
      }

      return undefined;
    },
    [],
  );

  const handleOnSearchHits = useCallback(
    async (peakList: Peak[], referenceSpectraList: string[]) => {
      setIsRequesting(true);
      const _hits = await searchHits(peakList, referenceSpectraList);
      setReferencePeakList(peakList);
      setHits(_hits);
      setIsRequesting(false);
    },
    [searchHits],
  );

  const searchPanel = useMemo(
    () => (
      <SearchPanel
        width={searchPanelWidth}
        height={searchPanelHeight}
        onSubmit={(data) => {
          console.log(data);
          const peakList: Peak[] = data.peakListInputField
            .split('\n')
            .map((line: string) => {
              const [mz, rel] = line.split(' ');
              return {
                mz: parseFloat(mz),
                intensity: parseFloat(rel),
                rel: parseFloat(rel),
                id: generateID(),
              } as Peak;
            });
          const referenceSpectraList = data.referenceSpectraInputField
            .split('\n')
            .filter((s: string) => s !== '');

          handleOnSearchHits(peakList, referenceSpectraList);
        }}
      />
    ),
    [handleOnSearchHits, searchPanelWidth],
  );

  async function fetchRecords(accessions: string[]) {
    const records: (Record | undefined)[] = [];

    for (const accession of accessions) {
      const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/' + accession;
      const resp = await axios.get(url);
      if (resp.status === 200) {
        const record = await resp.data;
        record.peak.peak.values = record.peak.peak.values.map((p) => ({
          ...p,
          id: generateID(),
        }));
        records.push(record);
      } else {
        records.push(undefined);
      }
    }

    return records;
  }

  return (
    <div ref={ref} className="search-view">
      {searchPanel}
      {isRequesting ? (
        <Spinner buttonDisabled={true} />
      ) : hits.length > 0 ? (
        <SpectralHitsView
          reference={referencePeakList}
          hits={hits}
          width={width}
          height={height - searchPanelHeight}
        />
      ) : (
        <Placeholder
          child={''}
          width={width}
          height={height - searchPanelHeight}
        />
      )}
    </div>
  );
}

export default SearchView;
