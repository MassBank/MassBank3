import './SpectralHitsCarouselView.scss';

import { useMemo } from 'react';
import Peak from '../../../../types/peak/Peak';
import Hit from '../../../../types/Hit';
import SpectralHitsViewComponent from './SpectralHitsViewComponent';
import { Carousel } from 'antd';

type InputProps = {
  reference?: Peak[];
  hits: Hit[];
  slideIndex?: number;
  width: number;
  height: number;
};

function SpectralHitsCarouselView({
  reference,
  hits,
  slideIndex = 0,
  width,
  height,
}: InputProps) {
  const _width = width - 75;

  const elements = useMemo(() => {
    return hits.map((hit, i) => (
      <SpectralHitsViewComponent
        key={'spectral-hits-view-component_' + i + '_' + hit.accession}
        reference={reference}
        hit={hit}
        width={_width - 80}
        height={height}
      />
    ));
  }, [_width, height, hits, reference]);

  return useMemo(
    () => (
      <Carousel
        initialSlide={slideIndex}
        infinite={false}
        dots={false}
        style={{
          width: _width,
          height,
        }}
        arrows
      >
        {elements}
      </Carousel>
    ),
    [_width, elements, height, slideIndex],
  );
}

export default SpectralHitsCarouselView;
