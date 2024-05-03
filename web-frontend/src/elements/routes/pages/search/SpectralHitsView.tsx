import { useMemo } from 'react';
import Peak from '../../../../types/peak/Peak';
import Chart from '../../../basic/Chart';
import Carousel, { ResponsiveType } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './SpectralHitsView.scss';
import Hit from '../../../../types/Hit';
import PeakTable from '../../../record/PeakTable';

type InputProps = {
  reference: Peak[];
  hits: Hit[];
  width?: number;
  height?: number;
};

function SpectralHitsView({
  reference,
  hits,
  width = 500,
  height = 300,
}: InputProps) {
  const elements = useMemo(() => {
    const _width = width - 120;
    const _height = height - 40;

    return hits.map((hit, i) => (
      <div
        className="chart-view"
        style={{
          width: _width,
          height: _height,
        }}
        key={'spectral_match_' + i}
      >
        <div className="chart-score-view">
          <p className="score-text">Score: {hit.score}</p>
          <Chart
            peakData={reference}
            peakData2={hit.peaks}
            width={_width * 0.7 - 10}
            height={_height - 50 - 10}
          />
        </div>
        <div className="peak-tables-view">
          <PeakTable
            peaks={reference}
            width={_width * 0.3}
            height={_height * 0.5}
          />
          <PeakTable
            peaks={hit.peaks}
            width={_width * 0.3}
            height={_height * 0.5}
          />
        </div>
      </div>
    ));
  }, [height, hits, reference, width]);

  const responsive = useMemo(() => {
    const items = 1;
    const breakpoint = { max: width, min: 100 };
    const responsive: ResponsiveType = {};
    elements.forEach((_element, i) => {
      responsive['item_' + i] = {
        breakpoint: breakpoint,
        items: items,
      };
    });

    return responsive;
  }, [elements, width]);

  return (
    <div className="spectra-view-wrapper" style={{ width, height }}>
      <Carousel
        className="spectra-view-carousel"
        responsive={responsive}
        swipeable={false}
        draggable={false}
        showDots={true}
      >
        {elements.map((element) => element)}
      </Carousel>
    </div>
  );
}

export default SpectralHitsView;
