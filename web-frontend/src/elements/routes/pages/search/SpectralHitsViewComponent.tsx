import Peak from '../../../../types/peak/Peak';
import Hit from '../../../../types/Hit';
import ResultInfo from '../../../result/ResultInfo';
import Resizable from '../../../common/Resizable';
import Record from '../../../../types/record/Record';
import { useMemo } from 'react';
import { Content } from 'antd/es/layout/layout';
import NeutralLoss from '../../../../types/peak/NeutralLoss';

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

    const record = { peak: { peak: { values: reference } } } as Record;
    if (hit.peakPairs && hit.peakPairs.length > 0) {
      const _neutralLossPeakPairs = hit.peakPairs?.map((nlp) => {
        const [peak1_id, peak2_id] = nlp.split('_').map((p) => 'peak-' + p);
        return { peak1_id, peak2_id };
      });
      const neutralLossData: NeutralLoss[] = [];
      for (const nlp of _neutralLossPeakPairs) {
        const peak1 = hit.record.peak.peak.values.find(
          (p) => p.id === nlp.peak1_id,
        );
        const peak2 = hit.record.peak.peak.values.find(
          (p) => p.id === nlp.peak2_id,
        );
        if (peak1 && peak2) {
          const difference = Math.abs(peak1.mz - peak2.mz);
          neutralLossData.push({
            peak1_id: peak1.id,
            peak2_id: peak2.id,
            difference,
          });
        }
      }
      hit.record.peak.neutral_loss = neutralLossData;
    }

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
            record={record}
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
