import Peak from '../../../../types/peak/Peak';
import Hit from '../../../../types/Hit';
import ResultInfo from '../../../result/ResultInfo';
import Resizable from '../../../record/Resizable';
import Record from '../../../../types/Record';
import { useMemo } from 'react';
import { Content } from 'antd/es/layout/layout';

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
  return useMemo(() => {
    const widthResultInfo = width * 0.25;
    const widthResizable = width - widthResultInfo;

    return (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid red',
          margin: 0,
        }}
      >
        <ResultInfo
          hit={hit}
          imageWidth={widthResultInfo}
          imageHeight={height}
          style={{
            width: widthResultInfo,
            height,
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
      </Content>
    );
  }, [height, hit, reference, width]);
}

export default SpectralHitsViewComponent;
