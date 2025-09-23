import DownloadFormat from '../../types/DownloadFormat';
import axios from 'axios';
import FileSaver from 'file-saver';
const { saveAs } = FileSaver;

async function downloadRecords(
  url: string,
  format: DownloadFormat,
  accessions: string[],
) {
  const resp = await axios.post(
    url,
    {
      record_list: accessions,
      format,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/octet-stream',
      },
    },
  );
  if (resp.status === 200) {
    const data = await resp.data;
    const fileType = format.split('_')[1];
    const filename =
      accessions.length === 1
        ? `${accessions[0]}.${format}.${fileType}`
        : `massbank_result.${format}.${fileType}`;
    const blob = new Blob([data], {
      type: 'application/octet-stream',
    });
    saveAs(blob, filename);
  }
}

export default downloadRecords;
