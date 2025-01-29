import fetchData from './fetchData';

async function getRecord(id: string) {
  const url = process.env.REACT_APP_MB3_API_URL + '/v1/records/' + id;
  return await fetchData(url);
}

export default getRecord;
