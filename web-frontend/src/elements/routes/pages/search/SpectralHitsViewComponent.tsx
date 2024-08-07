import './SpectralHitsViewComponent.scss';

import Peak from '../../../../types/peak/Peak';
import Hit from '../../../../types/Hit';
import ResultInfo from './result/ResultInfo';
import Resizable from '../../../record/Resizable';
import Record from '../../../../types/Record';
import { useMemo } from 'react';

type InputProps = {
  reference: Peak[];
  hit: Hit;
  width: number;
  height: number;
};

function SpectralHitsViewComponent({
  reference,
  hit,
  width,
  height,
}: InputProps) {
  const spectralHitsViewComponent = useMemo(
    () => (
      <div
        className="component-container"
        style={{
          width,
          height,
        }}
      >
        <ResultInfo
          hit={hit}
          imageWidth={width * 0.3}
          imageHeight={height}
          style={{ width: width * 0.3, height, backgroundColor: 'lightyellow' }}
        />
        <Resizable
          record={{ peak: { peak: { values: reference } } } as Record}
          record2={hit.record}
          width={width * 0.7}
          height={height}
        />
      </div>
    ),
    [height, hit, reference, width],
  );

  return spectralHitsViewComponent;
}

export default SpectralHitsViewComponent;
