import fetchData from './fetchData';

async function getRecord(id: string, backendUrl: string) {
  const url = backendUrl + '/records/' + id;
  return await fetchData(url);
}

export default getRecord;
