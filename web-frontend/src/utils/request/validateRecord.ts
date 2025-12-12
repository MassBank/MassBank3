import axios from 'axios';
import ValidationResult from '../../types/ValidationResult';

async function validateRecord(
  exportServiceUrl: string,
  rawText: string,
): Promise<ValidationResult> {
  try {
    const resp = await axios.post(
      exportServiceUrl + '/validate',
      { text: rawText },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    if (resp.status === 200 || resp.status === 422) {
      return (await resp.data) as ValidationResult;
    } else {
      return {
        message: `Unexpected response status: ${resp.status} : ${resp.statusText}`,
        line: null,
        column: null,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 422) {
        return (await error.response.data) as ValidationResult;
      } else {
        return {
          message: `Unexpected response status: ${error.response.status} : ${error.response.statusText}`,
          line: null,
          column: null,
        };
      }
    } else {
      return {
        message: `Request failed: ${error}`,
        line: null,
        column: null,
      };
    }
  }
}

export default validateRecord;
