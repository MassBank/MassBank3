import './RecordView.scss';

import Record from '../../types/record';
import InfoTable from './InfoTable';

type inputProps = {
  record: Record;
};

function RecordView({ record }: inputProps) {
  return (
    <div className="record-view-panel">
      <InfoTable record={record} />
    </div>
  );
}

export default RecordView;
