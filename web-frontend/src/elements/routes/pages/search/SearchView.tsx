import './SearchView.scss';

import { MouseEvent, useCallback, useRef, useState } from 'react';
import Peak from '../../../../types/peak/Peak';
import generateID from '../../../../utils/generateID';

import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Hit from '../../../../types/Hit';
import SpectralHitsView from './SpectralHitsView';
import Button from '../../../basic/Button';
import Spinner from '../../../basic/Spinner';

function SearchView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);

  const reference: Peak[] = [];

  reference.push({ mz: 1, intensity: 100, rel: 100, id: generateID() });
  reference.push({ mz: 5, intensity: 1000, rel: 1000, id: generateID() });
  reference.push({ mz: 10, intensity: 500, rel: 500, id: generateID() });

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [hits, setHits] = useState<Hit[]>([]);

  async function searchHits() {
    return await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const handleOnSearchHits = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsRequesting(true);

    searchHits().then(() => {
      const _hits: Hit[] = [];
      _hits.push({
        peaks: [
          { mz: 1, intensity: 100, rel: 100, id: generateID() },
          { mz: 4, intensity: 900, rel: 900, id: generateID() },
          { mz: 9, intensity: 400, rel: 400, id: generateID() },
        ],
        score: 0.5,
      });
      _hits.push({
        peaks: [
          { mz: 1.5, intensity: 10, rel: 10, id: generateID() },
          { mz: 7, intensity: 800, rel: 800, id: generateID() },
        ],
        score: 0.7,
      });
      _hits.push({
        peaks: [
          { mz: 3, intensity: 1000, rel: 1000, id: generateID() },
          { mz: 11, intensity: 100, rel: 100, id: generateID() },
        ],
        score: 0.9,
      });
      _hits.push({
        peaks: [
          { mz: 8, intensity: 300, rel: 300, id: generateID() },
          { mz: 10, intensity: 1000, rel: 1000, id: generateID() },
          { mz: 50, intensity: 800, rel: 800, id: generateID() },
        ],
        score: 0.2,
      });

      setHits(_hits);
      setIsRequesting(false);
    });
  }, []);

  return (
    <div ref={ref} className="search-view">
      <Button onClick={handleOnSearchHits} child="Search Hits" />
      {isRequesting ? (
        <Spinner buttonDisabled={true} />
      ) : hits.length > 0 ? (
        <SpectralHitsView
          reference={reference}
          hits={hits}
          width={width}
          height={height}
        />
      ) : (
        <p>No hits!</p>
      )}
    </div>
  );
}

export default SearchView;
