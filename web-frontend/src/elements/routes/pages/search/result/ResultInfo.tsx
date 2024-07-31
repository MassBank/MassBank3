import './ResultInfo.scss';

import Hit from '../../../../../types/Hit';
import StructureView from '../../../../basic/StructureView';
import ResultLink from './ResultLink';
import { CSSProperties } from 'react';

type InputProps = {
  hit: Hit;
  imageWidth?: number;
  imageHeight?: number;
  style?: CSSProperties;
};

function ResultInfo({ hit, imageWidth, imageHeight, style }: InputProps) {
  return (
    <div className="info-view" style={style}>
      <p className="accession-text">{hit.accession}</p>
      <div className="score-structure-view">
        <p className="score-text">Score: {hit.score}</p>
        {hit.record &&
        hit.record.compound.smiles &&
        hit.record.compound.smiles !== '' ? (
          <StructureView
            smiles={hit.record.compound.smiles}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
          />
        ) : undefined}
      </div>
      <ResultLink hit={hit} />
    </div>
  );
}

export default ResultInfo;
