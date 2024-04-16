import './Search.scss';

import { useRef } from 'react';
import Peak from '../../../../types/peak/Peak';
import generateID from '../../../../utils/generateID';
import SpectraView from '../../../basic/SpectraView';
import useContainerDimensions from '../../../../utils/useContainerDimensions';

function Search() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);

  const reference: Peak[] = [];
  const hits: Peak[][] = [];

  reference.push({ mz: 1, intensity: 100, rel: 100, id: generateID() });
  reference.push({ mz: 5, intensity: 1000, rel: 1000, id: generateID() });
  reference.push({ mz: 10, intensity: 500, rel: 500, id: generateID() });
  hits.push([
    { mz: 1, intensity: 100, rel: 100, id: generateID() },
    { mz: 4, intensity: 900, rel: 900, id: generateID() },
    { mz: 9, intensity: 400, rel: 400, id: generateID() },
  ]);
  hits.push([
    { mz: 1.5, intensity: 10, rel: 10, id: generateID() },
    { mz: 7, intensity: 800, rel: 800, id: generateID() },
  ]);
  hits.push([
    { mz: 3, intensity: 1000, rel: 1000, id: generateID() },
    { mz: 11, intensity: 100, rel: 100, id: generateID() },
  ]);
  hits.push([
    { mz: 8, intensity: 300, rel: 300, id: generateID() },
    { mz: 10, intensity: 1000, rel: 1000, id: generateID() },
    { mz: 50, intensity: 800, rel: 800, id: generateID() },
  ]);
  hits.push([
    { mz: 1, intensity: 100, rel: 100, id: generateID() },
    { mz: 4, intensity: 900, rel: 900, id: generateID() },
    { mz: 9, intensity: 400, rel: 400, id: generateID() },
  ]);
  hits.push([
    { mz: 1.5, intensity: 10, rel: 10, id: generateID() },
    { mz: 7, intensity: 800, rel: 800, id: generateID() },
  ]);
  hits.push([
    { mz: 3, intensity: 1000, rel: 1000, id: generateID() },
    { mz: 11, intensity: 100, rel: 100, id: generateID() },
  ]);
  hits.push([
    { mz: 8, intensity: 300, rel: 300, id: generateID() },
    { mz: 10, intensity: 1000, rel: 1000, id: generateID() },
    { mz: 50, intensity: 800, rel: 800, id: generateID() },
  ]);

  return (
    <div ref={ref} className="search-view">
      <SpectraView
        reference={reference}
        hits={hits}
        width={width}
        height={height}
      />
    </div>
  );
}

export default Search;
