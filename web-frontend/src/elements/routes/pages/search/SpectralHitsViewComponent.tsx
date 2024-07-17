import { useCallback, useState } from 'react';
import Peak from '../../../../types/peak/Peak';
import PeakTable from '../../../record/PeakTable';
import Chart from '../../../basic/Chart';

type InputProps = {
  referencePeaks: Peak[];
  hitPeaks: Peak[];
  accession: string;
  score: number;
  width: number;
  height: number;
};

function SpectralHitsViewComponent({
  referencePeaks,
  hitPeaks,
  accession,
  score,
  width,
  height,
}: InputProps) {
  const [filteredReferencePeaks, setFilteredReferencePeaks] =
    useState<Peak[]>(referencePeaks);
  const [filteredHitPeaks, setFilteredHitPeaks] = useState<Peak[]>(hitPeaks);

  const handleOnZoom = useCallback(
    (_filteredReferencePeaks: Peak[], _filteredHitPeaks?: Peak[]) => {
      setFilteredReferencePeaks(_filteredReferencePeaks);
      setFilteredHitPeaks(_filteredHitPeaks || []);
    },
    [],
  );

  return (
    <div
      className="chart-view"
      style={{
        width: width,
        height: height,
      }}
      key={'spectral_match_' + accession + '_' + score}
    >
      <div className="chart-score-view">
        <p className="score-text">Score: {score}</p>
        <Chart
          peakData={referencePeaks}
          peakData2={hitPeaks}
          width={width * 0.7 - 10}
          height={height - 50 - 10}
          onZoom={handleOnZoom}
        />
      </div>
      <div className="peak-tables-view">
        <PeakTable
          peaks={filteredReferencePeaks}
          width={width * 0.3}
          height={height * 0.5}
        />
        <PeakTable
          peaks={filteredHitPeaks}
          width={width * 0.3}
          height={height * 0.5}
        />
      </div>
    </div>
  );
}

export default SpectralHitsViewComponent;
