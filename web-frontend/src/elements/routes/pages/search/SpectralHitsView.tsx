import { useMemo } from 'react';
import Peak from '../../../../types/peak/Peak';
import Carousel, { ResponsiveType } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './SpectralHitsView.scss';
import Hit from '../../../../types/Hit';
import SpectralHitsViewComponent from './SpectralHitsViewComponent';

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

    return hits.map((hit) => (
      <SpectralHitsViewComponent
        key={hit.accession}
        referencePeaks={reference}
        hitPeaks={hit.record.peak.peak.values as Peak[]}
        accession={hit.accession}
        score={hit.score}
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
