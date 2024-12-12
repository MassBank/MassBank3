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
  const _width = width - 100;
  const _height = height - 50;

  const elements = useMemo(() => {
    return hits
      .filter((hit) => hit.record)
      .map((hit, i) => (
        <SpectralHitsViewComponent
          key={'spectral-hits-view-component_' + i + '_' + hit.accession}
          reference={reference}
          hit={hit}
          width={_width}
          height={_height}
        />
      ));
  }, [_height, _width, hits, reference]);

  return useMemo(
    () => (
      <Carousel
        initialSlide={slideIndex}
        arrows={true}
        infinite={false}
        dots={false}
        style={{
          width: _width,
          height: _height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid green',
        }}
      >
        {elements}
      </Carousel>
    ),
    [_height, _width, elements, slideIndex],
  );
}

export default SpectralHitsCarouselView;
