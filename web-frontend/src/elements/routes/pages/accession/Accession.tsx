import './Accession.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Input from '../../../basic/Input';
import Spinner from '../../../basic/Spinner';
import Button from '../../../basic/Button';
import RecordView from '../../../record/RecordView';
import generateID from '../../../../utils/generateID';
import Record from '../../../../types/Record';
import { useSearchParams } from 'react-router-dom';

const base = 'http://localhost:8081';

function Accession() {
  const [searchParams] = useSearchParams();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [accession, setAccession] = useState<string>('');
  const [requestedAccession, setRequestedAccession] = useState<string>('');
  const [record, setRecord] = useState<Record | undefined>();

  async function getRecord(base: string, id: string) {
    const url = base + '/v1/records/' + id;

    const resp = await fetch(url);
    if (resp.ok) {
      const jsonData = await resp.json();

      if (typeof jsonData === 'string') {
        return undefined;
      } else {
        return jsonData;
      }
    } else {
      return undefined;
    }
  }

  const search = useCallback(async (base: string, id: string) => {
    const rec = await getRecord(base, id);
    if (rec) {
      rec.peak.peak.values = rec.peak.peak.values.map((v) => {
        const _v = v;
        _v.id = generateID();
        return _v;
      });
    }
    setRecord(rec);
    setIsRequesting(false);
  }, []);

  const handleOnSearch = useCallback(
    (base: string, id: string) => {
      setIsRequesting(true);
      setRequestedAccession(id);
      search(base, id);
    },
    [search],
  );

  const recordView = useMemo(
    () =>
      record ? (
        <RecordView record={record} />
      ) : requestedAccession !== '' ? (
        <p>No database entry found for "{requestedAccession}"!</p>
      ) : undefined,
    [requestedAccession, record],
  );

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setAccession(id);
      handleOnSearch(base, id);
    }
  }, [handleOnSearch, searchParams]);

  const accessionView = useMemo(
    () => (
      <div className="accession-panel">
        <div className="input-panel">
          <Input
            type="search"
            placeholder="e.g. MSBNK-AAFC-AC000114"
            defaultValue={accession && accession !== '' ? accession : undefined}
            label="Search for accession: "
            onChange={(acc: string) => setAccession(acc.trim())}
            inputWidth="300px"
          />
          <Button
            child="Search"
            onClick={() => handleOnSearch(base, accession)}
            disabled={accession.trim() === ''}
            buttonStyle={
              accession.trim() === '' ? { color: 'grey' } : { color: 'black' }
            }
          />
        </div>
        <div className="result-panel">
          {isRequesting ? (
            <Spinner
              buttonText="Please Wait..."
              buttonDisabled={true}
              spinnerWidth={200}
              spinnerHeight={200}
            />
          ) : (
            recordView
          )}
        </div>
      </div>
    ),

    [accession, handleOnSearch, isRequesting, recordView],
  );

  return accessionView;
}

export default Accession;
