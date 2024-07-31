import './SpectralHitsViewComponent.scss';

import { useCallback, useState } from 'react';
import Peak from '../../../../types/peak/Peak';
import PeakTable from '../../../record/PeakTable';
import Chart from '../../../basic/Chart';
import Hit from '../../../../types/Hit';
import ResultInfo from './result/ResultInfo';

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
  const [filteredReferencePeaks, setFilteredReferencePeaks] =
    useState<Peak[]>(reference);
  const [filteredHitPeaks, setFilteredHitPeaks] = useState<Peak[]>(
    hit.record.peak.peak.values as Peak[],
  );

  const handleOnZoom = useCallback(
    (_filteredReferencePeaks: Peak[], _filteredHitPeaks?: Peak[]) => {
      setFilteredReferencePeaks(_filteredReferencePeaks);
      setFilteredHitPeaks(_filteredHitPeaks || []);
    },
    [],
  );

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
        imageWidth={width * 0.3}
        imageHeight={height}
        style={{ width: width * 0.3, height, backgroundColor: 'lightyellow' }}
      />
      <div className="chart-view">
        <Chart
          peakData={reference}
          peakData2={hit.record.peak.peak.values as Peak[]}
          width={width * 0.5}
          height={height}
          onZoom={handleOnZoom}
        />
      </div>
      <div className="peak-tables-view">
        <PeakTable
          peaks={filteredReferencePeaks}
          style={{ width: width * 0.2, height: height * 0.5 }}
        />
        <PeakTable
          peaks={filteredHitPeaks}
          style={{ width: width * 0.2, height: height * 0.5 }}
        />
      </div>
    </div>
  );
}

export default SpectralHitsViewComponent;
