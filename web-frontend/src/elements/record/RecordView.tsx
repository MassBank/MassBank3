import './RecordView.scss';

import InfoTable from './InfoTable';
import Record from '../../types/Record';

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
