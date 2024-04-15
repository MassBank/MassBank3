import { useMemo } from 'react';
import Peak from '../../types/peak/Peak';
import Chart from './Chart';
import Carousel, { ResponsiveType } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

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
  const elements = useMemo(
    () =>
      hits.map((hit, i) => (
        <Chart
          peakData={reference}
          peakData2={hit}
          onZoom={() => {}}
          width={width - 20}
          height={height - 20}
          key={'spectral_match_' + i}
        />
      )),
    [height, hits, reference, width],
  );

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
    <div style={{ width: width, height }}>
      <Carousel
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
