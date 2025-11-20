type RequestResponse<T> = {
  data: T | null;
  message: string;
  status: 'success' | 'error';
};

export default RequestResponse;
