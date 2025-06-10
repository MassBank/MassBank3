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
        const split = nlp.split('_');
        return { peakId: 'peak-' + split[0], precursor_mass: Number(split[1]) };
      });
      const neutralLossData: NeutralLoss[] = [];
      for (const nlp of _neutralLossPeakPairs) {
        const peak = hit.record.peak.peak.values.find(
          (p: Peak) => p.id === nlp.peakId,
        );
        if (peak) {
          const difference = Math.abs(peak.mz - nlp.precursor_mass);
          neutralLossData.push({
            peak_id: peak.id,
            precursor_mass: nlp.precursor_mass,
            difference,
          });
        }
      }
      hit.record.peak.neutral_loss = neutralLossData;
    }

    // in case of missing relative intensity values
    hit.record.peak.peak.values = hit.record.peak.peak.values.map((p: Peak) => {
      const _p = p;
      _p.rel = _p.rel ?? 0;
      return _p;
    });

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
