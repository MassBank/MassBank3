interface StatusResult {
  api: {
    status: string;
    version?: string;
    error?: string;
  };
  postgres: {
    status: string;
    version?: string;
    error?: string;
  };
  similarity_service: {
    status: string;
    version?: string;
    error?: string;
  };
  export_service: {
    status: string;
    version?: string;
    error?: string;
  };
}

export default StatusResult;
