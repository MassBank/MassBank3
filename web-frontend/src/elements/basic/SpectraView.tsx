import { useMemo } from 'react';
import Peak from '../../types/peak/Peak';
import Chart from './Chart';
import Carousel, { ResponsiveType } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './SpectraView.scss';

type InputProps = {
  reference: Peak[];
  hits: Peak[][];
  width?: number;
  height?: number;
};

function SpectraView({
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
        <Chart
          peakData={reference}
          peakData2={hit}
          onZoom={() => {}}
          width={_width}
          height={_height}
        />
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

export default SpectraView;
