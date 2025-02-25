interface StatusResult {
  postgres: {
    status: string;
    error?: string;
  };
  similarity_service: {
    status: string;
    error?: string;
  };
  export_service: {
    status: string;
    error?: string;
  };
}

export default StatusResult;
