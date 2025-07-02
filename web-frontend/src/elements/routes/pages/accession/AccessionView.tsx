import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RecordView from '../../../record/RecordView';
import Record from '../../../../types/record/Record';
import { Spin } from 'antd';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import { Content } from 'antd/es/layout/layout';
import { useSearchParams } from 'react-router-dom';
import { usePropertiesContext } from '../../../../context/properties/properties';
import getRecord from '../../../../utils/request/fetchRecord';

function AccessionView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const { backendUrl } = usePropertiesContext();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [requestedAccession, setRequestedAccession] = useState<string>('');
  const [record, setRecord] = useState<Record | undefined>();
  const [searchParams] = useSearchParams();
  const accession = searchParams.get('id');

  const handleOnSearch = useCallback(
    async (acc: string) => {
      setIsRequesting(true);
      setRequestedAccession(acc);

      setRecord(await getRecord(acc, backendUrl));

      setIsRequesting(false);
    },
    [backendUrl],
  );

  useEffect(() => {
    if (accession) {
      handleOnSearch(accession);
    }
  }, [accession, handleOnSearch]);

  const recordView = useMemo(
    () =>
      record ? (
        <RecordView record={record} width={width} height={height} />
      ) : requestedAccession !== '' ? (
        <p style={{ fontWeight: 'bolder', fontSize: 'larger' }}>
          No database entry found for "{requestedAccession}"
        </p>
      ) : undefined,
    [record, width, height, requestedAccession],
  );

  return useMemo(
    () => (
      <Content
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isRequesting ? <Spin size="large" /> : recordView}
      </Content>
    ),
    [isRequesting, recordView],
  );
}

export default AccessionView;
