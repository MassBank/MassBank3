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
import axios from 'axios';

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
      if (rec.title) {
        document.title = rec.title + ' MassBank';
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

  const removeRecordMetadataChildNode = useCallback(() => {
    const metadataElement = document.getElementById('recordMetadata');
    if (metadataElement) {
      document.head.removeChild(metadataElement);
    }
  }, []);

  const addRecordMetadataChildNode = useCallback(
    async (_accession: string) => {
      const host = import.meta.env.VITE_EXPORT_SERVICE_URL;
      const url = `${host}/metadata/${_accession}`;

      const resp = await axios.get(url, {
        headers: {
          Accept: 'application/ld+json',
        },
      });
      if (resp.status === 200) {
        const data = await resp.data;
        if (data) {
          const json =
            '[' +
            (data as object[])
              .map((d) => {
                // delete d['about'];
                // delete d['subjectOf'];
                return JSON.stringify(d, null, 2);
              })
              .join(',\n') +
            ']';
          removeRecordMetadataChildNode();
          const scriptElement = document.createElement('script');
          scriptElement.id = 'recordMetadata';
          scriptElement.type = 'application/ld+json';
          scriptElement.textContent = json;
          document.head.appendChild(scriptElement);

          return scriptElement;
        }
      }
    },
    [removeRecordMetadataChildNode],
  );

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      addRecordMetadataChildNode(id);
      setAccession(id);
      handleOnSearch(id);
    }
    return () => {
      removeRecordMetadataChildNode();
    };
  }, [
    addRecordMetadataChildNode,
    handleOnSearch,
    removeRecordMetadataChildNode,
    searchParams,
  ]);

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
