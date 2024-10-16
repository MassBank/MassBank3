import 'react-multi-carousel/lib/styles.css';
import './SpectralHitsCarouselView.scss';

import { useEffect, useMemo, useState } from 'react';
import Peak from '../../../../types/peak/Peak';
import Carousel, { ResponsiveType } from 'react-multi-carousel';
import Hit from '../../../../types/Hit';
import SpectralHitsViewComponent from './SpectralHitsViewComponent';

type InputProps = {
  reference?: Peak[];
  hits: Hit[];
  slideIndex?: number;
  width?: number;
  height?: number;
};

function SpectralHitsCarouselView({
  reference,
  hits,
  slideIndex = 0,
  width = 500,
  height = 300,
}: InputProps) {
  const elements = useMemo(() => {
    const _width = width - 120;
    const _height = height - 40;

    return hits
      .filter((hit) => hit.record)
      .map((hit) => (
        <SpectralHitsViewComponent
          key={
            'spectral-hits-view-component_' + hit.accession + '_' + hit.score
          }
          reference={reference}
          hit={hit}
          width={_width}
          height={_height}
        />
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

  const [carousel, setCarousel] = useState<Carousel | null>(null);

  useEffect(() => {
    carousel?.setState({ currentSlide: slideIndex });
  }, [carousel, slideIndex]);

  return (
    <div className="spectra-view-wrapper" style={{ width, height }}>
      <Carousel
        className="spectra-view-carousel"
        responsive={responsive}
        swipeable={false}
        draggable={false}
        showDots={true}
        ref={(el) => setCarousel(el)}
      >
        {elements}
      </Carousel>
    </div>
  );
}

export default SpectralHitsCarouselView;
