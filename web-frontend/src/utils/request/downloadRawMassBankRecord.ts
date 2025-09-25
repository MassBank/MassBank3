import FileSaver from 'file-saver';
import fetchRawMassBankRecord from './fetchRawMassBankRecord';
const { saveAs } = FileSaver;

async function downloadRawMassBankRecord(
  exportServiceUrl: string,
  accession: string,
) {
  const data = await fetchRawMassBankRecord(exportServiceUrl, accession);
  if (data !== null) {
    const filename = accession + '.txt';
    const blob = new Blob([data], {
      type: 'text/plain',
    });
    saveAs(blob, filename);
  } else {
    console.error(
      'Could not fetch raw MassBank record for accession ' + accession,
    );
  }
}

export default downloadRawMassBankRecord;
