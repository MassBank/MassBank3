import './SpectralHitsViewComponent.scss';

import Peak from '../../../../types/peak/Peak';
import Hit from '../../../../types/Hit';
import ResultInfo from '../../../result/ResultInfo';
import Resizable from '../../../record/Resizable';
import Record from '../../../../types/Record';
import { useMemo } from 'react';

type InputProps = {
  reference?: Peak[];
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
  const spectralHitsViewComponent = useMemo(() => {
    const widthResultInfo = width * 0.25;
    const widthResizable = width - widthResultInfo;

    return (
      <div
        className="component-container"
        style={{
          width,
          height,
        }}
      >
        <ResultInfo
          hit={hit}
          imageWidth={widthResultInfo}
          imageHeight={height}
          style={{
            width: widthResultInfo,
            height,
            backgroundColor: 'lightyellow',
          }}
        />
        {reference && reference.length > 0 ? (
          <Resizable
            record={{ peak: { peak: { values: reference } } } as Record}
            record2={hit.record}
            width={widthResizable}
            height={height}
          />
        ) : (
          <Resizable
            record={hit.record}
            width={widthResizable}
            height={height}
          />
        )}
      </div>
    );
  }, [height, hit, reference, width]);

  return spectralHitsViewComponent;
}

export default SpectralHitsViewComponent;
