import './Accession.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Input from '../../../basic/Input';
import Spinner from '../../../basic/Spinner';
import Button from '../../../basic/Button';
import RecordView from '../../../record/RecordView';
import generateID from '../../../../utils/generateID';
import Record from '../../../../types/Record';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import routes from '../../../../constants/routes';

function Accession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [accession, setAccession] = useState<string>('');
  const [requestedAccession, setRequestedAccession] = useState<string>('');
  const [record, setRecord] = useState<Record | undefined>();

  async function getRecord(id: string) {
    const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/' + id;

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

  const handleOnSearch = useCallback(async (id: string) => {
    setIsRequesting(true);
    setRequestedAccession(id);

    const rec: Record | undefined = await getRecord(id);
    if (rec) {
      rec.peak.peak.values = rec.peak.peak.values.map((p) => {
        const _p = p;
        _p.id = generateID();
        return _p;
      });
      if (rec.compound && rec.compound.names && rec.compound.names.length > 0) {
        document.title = rec.compound.names[0] + ' Mass Spectrum';
      }
    }
    setRecord(rec);
    setIsRequesting(false);
  }, []);

  const handleOnClick = useCallback(() => {
    navigate({
      pathname: routes.accession.path,
      search: `?${createSearchParams({ id: accession })}`,
    });
  }, [accession, navigate]);

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
      handleOnSearch(id);
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
            onKeyDown={handleOnClick}
            inputWidth="300px"
          />
          <Button
            child="Search"
            onClick={handleOnClick}
            disabled={accession.trim() === ''}
            buttonStyle={
              accession.trim() === '' ? { color: 'grey' } : { color: 'black' }
            }
          />
        </div>
        <div className="result-panel">
          {isRequesting ? (
            <Spinner
              buttonStyle={{ display: 'none' }}
              spinnerWidth={200}
              spinnerHeight={200}
            />
          ) : (
            recordView
          )}
        </div>
      </div>
    ),

    [accession, handleOnClick, isRequesting, recordView],
  );

  return accessionView;
}

export default Accession;
