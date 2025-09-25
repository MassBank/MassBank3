import DownloadFormat from '../../types/DownloadFormat';
import axios from 'axios';
import FileSaver from 'file-saver';
const { saveAs } = FileSaver;

async function downloadRecords(
  exportServiceUrl: string,
  format: DownloadFormat,
  accessions: string[],
) {
  const resp = await axios.post(
    exportServiceUrl + '/convert',
    {
      record_list: accessions,
      format,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: format === 'massbank' ? 'application/zip' : 'text/plain',
      },
      responseType: format === 'massbank' ? 'blob' : 'text',
    },
  );
  if (resp.status === 200) {
    const data = await resp.data;
    const fileType = format === 'massbank' ? 'zip' : format.split('_')[1];
    const filename =
      accessions.length === 1
        ? `${accessions[0]}.${format}.${fileType}`
        : `massbank_result.${format}.${fileType}`;
    const blob = new Blob([data], {
      type: format === 'massbank' ? 'application/zip' : 'text/plain',
    });
    saveAs(blob, filename);
  } else {
    console.error('Could not fetch records:', resp.statusText);
  }
}

export default downloadRecords;
