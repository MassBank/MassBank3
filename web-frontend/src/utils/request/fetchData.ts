import axios from 'axios';
import SearchParams from '../../types/SearchParams';

async function fetchData(url: string, searchParams?: SearchParams) {
  const params = new URLSearchParams();
  if (searchParams) {
    Object.keys(searchParams).forEach((key) => {
      params.append(key, searchParams[key].join(','));
    });
  }

  const resp = await axios.get(url, { params });
  if (resp.status === 200) {
    return await resp.data;
  }

  return undefined;
}

export default fetchData;
