import axios from 'axios';
import SearchParams from '../../types/SearchParams';
import RequestResponse from '../../types/RequestResponse';
import Record from '../../types/record/Record';
import Metadata from '../../types/Metadata';
import SearchResult from '../../types/SearchResult';
import ContentFilterOptions from '../../types/filterOptions/ContentFilterOtions';

type responseType =
  | Record
  | SearchResult
  | Metadata
  | ContentFilterOptions
  | string
  | number;

async function fetchData(
  url: string,
  searchParams?: SearchParams,
): Promise<RequestResponse<responseType>> {
  const response: RequestResponse<responseType> = {
    data: null,
    message: '',
    status: 'error',
  };

  const params = new URLSearchParams();
  if (searchParams) {
    Object.keys(searchParams).forEach((key) => {
      params.append(key, searchParams[key].join(','));
    });
  }

  try {
    const resp = await axios.get(url, { params });
    if (resp.status === 200) {
      response.data = resp.data;
      response.message = 'Request was successful';
      response.status = 'success';
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message + ' -> ' + error.stack
        : 'Unknown error';

    response.message = errorMessage;
    response.status = 'error';
  }

  return response;
}

export default fetchData;
