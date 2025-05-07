import { Content } from 'antd/es/layout/layout';
import Hit from '../../types/Hit';
import StructureView from '../basic/StructureView';
import ResultLink from './ResultLink';
import Placeholder from '../basic/Placeholder';

type InputProps = {
  hit: Hit;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
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
        borderRight: '1px solid black',
      }}
    >
      <p
        style={{
          width: '100%',
          height: 20,
          fontSize: 17,
          color: 'brown',
          fontWeight: 'bold',
        }}
      >
        {hit.accession}
      </p>
      <Content
        style={{
          width: '100%',
          height: 50,
          marginTop: 5,
          marginBottom: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {hit.score ? (
          <p
            style={{
              margin: 0,
              width: '100%',
              height: '100%',
              fontSize: 17,
              fontWeight: 'bolder',
            }}
          >
            {`Score: ${hit.score}`}
          </p>
        ) : (
          <Placeholder child="" style={{ height: 20 }} />
        )}
      </Content>
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {hit.record && hit.record.compound.smiles ? (
          <StructureView
            smiles={hit.record.compound.smiles}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            disableExport
          />
        ) : (
          <Placeholder
            child="No structure"
            style={{ width: imageWidth, height: imageHeight }}
          />
        )}
      </Content>

      <p
        style={{
          width: '100%',
          height: 600,
          textWrap: 'pretty',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
          overflowY: 'scroll',
        }}
      >
        {hit.record.title}
      </p>
      <ResultLink hit={hit} height={100} />
    </Content>
  );
}

export default ResultInfo;
