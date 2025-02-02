import Peak from '../../../../types/peak/Peak';
import Hit from '../../../../types/Hit';
import ResultInfo from '../../../result/ResultInfo';
import Resizable from '../../../common/Resizable';
import Record from '../../../../types/record/Record';
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
    const widthResultInfo = width / 4;
    const widthResizable = width - widthResultInfo;

    return (
      <Content
        style={{
          width,
          height,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
          border: '1px solid black',
        }}
      >
        <ResultInfo
          hit={hit}
          width={widthResultInfo}
          height={height}
          imageWidth={widthResultInfo - 50}
          imageHeight={widthResultInfo - 50}
        />
        {reference && reference.length > 0 ? (
          <Resizable
            record={{ peak: { peak: { values: reference } } } as Record}
            record2={hit.record}
            width={widthResizable}
            height={height}
            disableExport
          />
        ) : (
          <Resizable
            record={hit.record}
            width={widthResizable}
            height={height}
            disableExport
          />
        )}
      </Content>
    );
  }, [height, hit, reference, width]);
}

export default SpectralHitsViewComponent;
