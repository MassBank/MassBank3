import { useEffect, useState } from 'react';
import { usePropertiesContext } from '../../../../context/properties/properties';
import fetchServiceStatus from '../../../../utils/request/fetchServiceStatus';
import StatusResult from '../../../../types/StatusResult';
import { Alert } from 'antd';

function StatusMessage() {
  const { backendUrl } = usePropertiesContext();
  const [status, setStatus] = useState<StatusResult | null>(null);

  useEffect(() => {
    const checkServiceStatus = async () => {
      const url = `${backendUrl}/status`;
      const _status = await fetchServiceStatus(url);

      setStatus(_status);
    };

    checkServiceStatus();
  }, [backendUrl]);

  return status &&
    (status.api.error ||
      status.postgres.error ||
      status.similarity_service.error ||
      status.export_service.error) ? (
    <Alert
      style={{ width: '100%' }}
      message="Status Warning"
      description={
        'Some of the backend services are not available. Not all features may work.'
      }
      type="warning"
      showIcon
    />
  ) : status && status.postgres.updateStatus !== 'done' ? (
    <Alert
      style={{ width: '100%' }}
      message="Status Warning"
      description={
        status.postgres.updateStatus === 'updating'
          ? 'The database is currently being updated. Some features and records may be not available yet.'
          : 'The database update status is unknown. Some features and records may be unavailable.'
      }
      type="warning"
      showIcon
    />
  ) : null;
}

export default StatusMessage;
