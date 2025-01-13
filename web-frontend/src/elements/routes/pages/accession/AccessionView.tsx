import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RecordView from '../../../record/RecordView';
import generateID from '../../../../utils/generateID';
import Record from '../../../../types/Record';
import { useSearchParams } from 'react-router-dom';
import fetchData from '../../../../utils/fetchData';
import { Layout, Spin } from 'antd';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import { Content, Header } from 'antd/es/layout/layout';
import AccessionSearchInputField from '../../../common/AccessionSearchInputField';

function AccessionView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const [searchParams] = useSearchParams();

  const [accession, setAccession] = useState<string>('');
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [requestedAccession, setRequestedAccession] = useState<string>('');
  const [record, setRecord] = useState<Record | undefined>();

  const headerHeight = 50;

  async function getRecord(id: string) {
    const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/' + id;
    return await fetchData(url);
  }

  const handleOnSearch = useCallback(async (id: string) => {
    setIsRequesting(true);
    setRequestedAccession(id);

    const rec: Record | undefined = await getRecord(id);
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

  const recordView = useMemo(
    () =>
      record ? (
        <RecordView
          record={record}
          width={width}
          height={height - headerHeight}
        />
      ) : requestedAccession !== '' ? (
        <p style={{ fontWeight: 'bolder', fontSize: 'larger' }}>
          No database entry found for "{requestedAccession}"
        </p>
      ) : undefined,
    [record, width, height, requestedAccession],
  );

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setAccession(id);
      handleOnSearch(id);
    }
  }, [handleOnSearch, searchParams]);

  return useMemo(
    () => (
      <Layout ref={ref} style={{ width: '100%', height: '100%' }}>
        <Header style={{ width: '100%', height: headerHeight, padding: 0 }}>
          <AccessionSearchInputField
            width="100%"
            height={headerHeight}
            accession={accession}
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

    [accession, height, isRequesting, recordView],
  );
}

export default AccessionView;
