import StatusResult from '../../types/StatusResult';
import fetchData from './fetchData';

async function fetchServiceStatus(url: string): Promise<StatusResult> {
  const _status: StatusResult = {
    api: { status: 'Unknown', version: undefined, error: undefined },
    postgres: {
      status: 'Unknown',
      updateStatus: 'Unknown',
      version: undefined,
      error: undefined,
    },
    similarity_service: {
      status: 'Unknown',
      version: undefined,
      error: undefined,
    },
    export_service: {
      status: 'Unknown',
      version: undefined,
      error: undefined,
    },
  };

  const response = await fetchData(url);
  if (response.status === 'success') {
    if (response.data) {
      const statusResult = response.data as StatusResult;
      _status.api = statusResult.api;
      _status.postgres = statusResult.postgres;
      _status.postgres.version = statusResult.postgres.version?.split(' (')[0]; // Only keep the version number, not the build date
      _status.similarity_service = statusResult.similarity_service;
      _status.similarity_service.version =
        statusResult.similarity_service.version?.replace(/"/g, '');
      _status.export_service = statusResult.export_service;
      _status.export_service.version =
        statusResult.export_service.version?.replace(/"/g, '');
    } else {
      _status.api.status = "Couldn't connect to the API";
      _status.api.error = response.message;
      _status.postgres.status = "Couldn't connect to the API";
      _status.postgres.error = "Couldn't connect to the API";
      _status.similarity_service.status = "Couldn't connect to the API";
      _status.similarity_service.error = "Couldn't connect to the API";
      _status.export_service.status = "Couldn't connect to the API";
      _status.export_service.error = "Couldn't connect to the API";
    }
  } else {
    _status.api.status = "Couldn't connect to the API";
    _status.api.error = response.message;
    _status.postgres.status = "Couldn't connect to the API";
    _status.postgres.error = "Couldn't connect to the API";
    _status.similarity_service.status = "Couldn't connect to the API";
    _status.similarity_service.error = "Couldn't connect to the API";
    _status.export_service.status = "Couldn't connect to the API";
    _status.export_service.error = "Couldn't connect to the API";
  }

  return _status;
}

export default fetchServiceStatus;
