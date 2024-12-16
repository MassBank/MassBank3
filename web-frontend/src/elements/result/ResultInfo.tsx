import { Content } from 'antd/es/layout/layout';
import Hit from '../../types/Hit';
import StructureView from '../basic/StructureView';
import ResultLink from './ResultLink';
import Placeholder from '../basic/Placeholder';

type InputProps = {
  hit: Hit;
  width: number;
  height: number;
  imageWidth?: number;
  imageHeight?: number;
};

function ResultInfo({
  hit,
  imageWidth,
  imageHeight,
  width,
  height,
}: InputProps) {
  return (
    <Content
      style={{
        width,
        height,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid grey',
      }}
    >
      <p>{hit.accession}</p>

      {hit.score && <p>Score: {hit.score}</p>}
      {hit.record && hit.record.compound.smiles ? (
        <StructureView
          smiles={hit.record.compound.smiles}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
      ) : (
        <Placeholder
          child="No structure"
          style={{ width: imageWidth, height: imageHeight }}
        />
      )}

      <label>{hit.record.title}</label>
      <ResultLink hit={hit} />
    </Content>
  );
}

export default ResultInfo;
