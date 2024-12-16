import './AccessionView.scss';

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import RecordView from '../../../record/RecordView';
import generateID from '../../../../utils/generateID';
import Record from '../../../../types/Record';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import routes from '../../../../constants/routes';
import fetchData from '../../../../utils/fetchData';
import { Button, Input, Spin } from 'antd';

function AccessionView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [accession, setAccession] = useState<string>('');
  const [requestedAccession, setRequestedAccession] = useState<string>('');
  const [record, setRecord] = useState<Record | undefined>();

  async function getRecord(id: string) {
    const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/' + id;
    return await fetchData(url);
  }

  const handleOnSearch = useCallback(async (id: string) => {
    setIsRequesting(true);
    setRequestedAccession(id);

    const rec: Record | undefined = await getRecord(id);
    console.log(rec);

    if (rec && typeof rec === 'object') {
      rec.peak.peak.values = rec.peak.peak.values.map((p) => {
        const _p = p;
        _p.id = generateID();
        return _p;
      });
      if (rec.compound && rec.compound.names && rec.compound.names.length > 0) {
        document.title = rec.compound.names[0] + ' Mass Spectrum';
      }
      setRecord(rec);
    } else {
      setRecord(undefined);
    }
    setIsRequesting(false);
  }, []);

  const handleOnClick = useCallback(
    () =>
      navigate({
        pathname: routes.accession.path,
        search: `?${createSearchParams({ id: accession })}`,
      }),
    [accession, navigate],
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
      handleOnSearch(id);
    }
  }, [handleOnSearch, searchParams]);

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setAccession(e.target.value.trim());
  }, []);

  const accessionView = useMemo(
    () => (
      <div className="accession-panel">
        <div className="input-panel">
          <Input
            type="text"
            placeholder="e.g. MSBNK-AAFC-AC000114"
            value={accession && accession !== '' ? accession : undefined}
            addonBefore="Search for accession: "
            onChange={handleOnChange}
            onKeyDown={handleOnClick}
            allowClear
          />
          <Button
            children="Search"
            onClick={handleOnClick}
            disabled={accession.trim() === ''}
            style={
              accession.trim() === '' ? { color: 'grey' } : { color: 'black' }
            }
          />
        </div>
        <div className="result-panel">
          {isRequesting ? <Spin size="large" /> : recordView}
        </div>
      </div>
    ),

    [accession, handleOnChange, handleOnClick, isRequesting, recordView],
  );

  return accessionView;
}

export default AccessionView;
