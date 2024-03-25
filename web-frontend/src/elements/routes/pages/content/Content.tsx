import { useCallback, useEffect, useState } from 'react';
import Spinner from '../../../basic/Spinner';

function Content() {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [recordCount, setRecordCount] = useState<number | undefined>();

  async function getRecordCount() {
    const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/count';

    const resp = await fetch(url);
    if (resp.ok) {
      return await resp.json();
    } else {
      return undefined;
    }
  }

  const handleOnFetch = useCallback(async () => {
    setIsRequesting(true);

    const count: number | undefined = await getRecordCount();

    setRecordCount(count);
    setIsRequesting(false);
  }, []);

  useEffect(() => {
    handleOnFetch();
  }, [handleOnFetch]);

  return (
    <div>
      {isRequesting ? (
        <Spinner buttonDisabled buttonStyle={{ display: 'none' }} />
      ) : (
        <h2>
          {recordCount
            ? `MassBank has ${recordCount} entries!`
            : 'Could not fetch record count!'}
        </h2>
      )}
    </div>
  );
}

export default Content;
