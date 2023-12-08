import './RecordView.scss';

import Record from '../../types/record';
import StructureView from '../basic/StructureView';

type inputProps = {
  record: Record;
};

function RecordView({ record }: inputProps) {
  return (
    <div className="record-view-panel">
      <p>{record.accession}</p>
      <p>{record.title}</p>
      {record.compound.smiles && record.compound.smiles !== '' ? (
        <StructureView smiles={record.compound.smiles} />
      ) : undefined}
    </div>
  );
}

export default RecordView;
