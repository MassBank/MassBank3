import fetchData from "./fetchData";

async function getRecord(id: string) {
  const url = import.meta.env.VITE_MB3_API_URL + "/v1/records/" + id;
  return await fetchData(url);
}

export default getRecord;
