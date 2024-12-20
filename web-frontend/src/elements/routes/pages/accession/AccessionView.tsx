import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { Button, Input, Layout, Spin } from 'antd';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import { Content, Header } from 'antd/es/layout/layout';

function AccessionView() {
  const ref = useRef(null);
  const { height } = useContainerDimensions(ref);
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
        <p style={{ fontWeight: 'bolder', fontSize: 'larger' }}>
          No database entry found for "{requestedAccession}"
        </p>
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

  const handleOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleOnClick();
      }
    },
    [handleOnClick],
  );

  const headerHeight = 50;

  return useMemo(
    () => (
      <Layout ref={ref} style={{ width: '100%', height: '100%' }}>
        <Header
          style={{
            width: '100%',
            height: headerHeight,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'beige',
          }}
        >
          <Input
            type="text"
            placeholder="e.g. MSBNK-AAFC-AC000114"
            value={accession && accession !== '' ? accession : undefined}
            addonBefore="Go to accession:"
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            allowClear
            style={{ width: 500 }}
          />
          <Button
            children="Search"
            onClick={handleOnClick}
            disabled={accession.trim() === ''}
            style={{ width: 100 }}
          />
        </Header>
        <Content
          style={{
            width: '100%',
            height: height - headerHeight,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isRequesting ? <Spin size="large" /> : recordView}
        </Content>
      </Layout>
    ),

    [
      accession,
      handleOnChange,
      handleOnClick,
      handleOnKeyDown,
      height,
      isRequesting,
      recordView,
    ],
  );
}

export default AccessionView;
