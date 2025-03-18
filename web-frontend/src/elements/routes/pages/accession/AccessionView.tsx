import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RecordView from '../../../record/RecordView';
import Record from '../../../../types/record/Record';
import { Layout, Spin } from 'antd';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import { Content, Header } from 'antd/es/layout/layout';
import AccessionSearchInputField from '../../../common/AccessionSearchInputField';
import searchAccession from '../../../../utils/request/searchAccession';
import { useSearchParams } from 'react-router-dom';
import { usePropertiesContext } from '../../../../context/properties/properties';
import accessionSearchInputFieldHeight from '../../../../constants/accessionSearchInputFieldHeight';

function AccessionView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const { backendUrl } = usePropertiesContext();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [requestedAccession, setRequestedAccession] = useState<string>('');
  const [record, setRecord] = useState<Record | undefined>();
  const [searchParams] = useSearchParams();
  const [accession, setAccession] = useState<string | null>(null);

  const handleOnSearch = useCallback(
    async (acc: string) => {
      setIsRequesting(true);
      setRequestedAccession(acc);

      setRecord(await searchAccession(acc, backendUrl));

      setIsRequesting(false);
    },
    [backendUrl],
  );

  useEffect(() => {
    const _accession = searchParams.get('id');
    setAccession(_accession);

    if (_accession) {
      handleOnSearch(_accession);
    }
  }, [handleOnSearch, searchParams]);

  const recordView = useMemo(
    () =>
      record ? (
        <RecordView
          record={record}
          width={width}
          height={height - accessionSearchInputFieldHeight}
        />
      ) : requestedAccession !== '' ? (
        <p style={{ fontWeight: 'bolder', fontSize: 'larger' }}>
          No database entry found for "{requestedAccession}"
        </p>
      ) : undefined,
    [record, width, height, requestedAccession],
  );

  return useMemo(
    () => (
      <Layout ref={ref} style={{ width: '100%', height: '100%' }}>
        <Header
          style={{
            width: '100%',
            height: accessionSearchInputFieldHeight,
            padding: 0,
          }}
        >
          <AccessionSearchInputField
            accession={accession ?? ''}
            style={{
              height: accessionSearchInputFieldHeight,
              backgroundColor: '#f3ece0',
            }}
          />
        </Header>
        <Content
          style={{
            width: '100%',
            height: height - accessionSearchInputFieldHeight,
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
