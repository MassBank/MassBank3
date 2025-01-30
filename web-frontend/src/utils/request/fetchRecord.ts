import fetchData from './fetchData';

async function getRecord(id: string, backendUrl: string) {
  const url = backendUrl + '/v1/records/' + id;
  return await fetchData(url);
}

export default getRecord;
