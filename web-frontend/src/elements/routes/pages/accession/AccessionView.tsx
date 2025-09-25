import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RecordView from '../../../record/RecordView';
import Record from '../../../../types/record/Record';
import { Spin } from 'antd';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import { Content } from 'antd/es/layout/layout';
import { useSearchParams } from 'react-router-dom';
import { usePropertiesContext } from '../../../../context/properties/properties';
import getRecord from '../../../../utils/request/fetchRecord';
import Text from 'antd/es/typography/Text';
import fetchRawMassBankRecord from '../../../../utils/request/fetchRawMassBankRecord';

function AccessionView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);
  const { backendUrl, exportServiceUrl } = usePropertiesContext();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [requestedAccession, setRequestedAccession] = useState<string>('');
  const [record, setRecord] = useState<Record | undefined>();
  const [rawTextElements, setRawTextElements] = useState<JSX.Element[]>([]);
  const [searchParams] = useSearchParams();

  const accession = searchParams.get('id');
  const showRaw = searchParams.get('raw') !== null;

  const handleOnSearch = useCallback(
    async (acc: string, raw: boolean) => {
      setIsRequesting(true);
      setRequestedAccession(acc);

      if (raw) {
        const rawMassBankRecordText = await fetchRawMassBankRecord(
          exportServiceUrl,
          acc,
        );
        if (rawMassBankRecordText) {
          setRawTextElements(
            rawMassBankRecordText.split(/\n/g).map((line: string) => (
              <label key={line}>
                {line}
                <br />
              </label>
            )),
          );
        } else {
          setRawTextElements([
            <label>No raw MassBank record found for accession "{acc}"</label>,
          ]);
        }
      } else {
        setRecord(await getRecord(acc, backendUrl));
      }

      setIsRequesting(false);
    },
    [backendUrl, exportServiceUrl],
  );

  useEffect(() => {
    if (accession) {
      if (showRaw) {
        handleOnSearch(accession, true);
      } else {
        handleOnSearch(accession, false);
      }
    }
  }, [accession, handleOnSearch, showRaw]);

  const recordView = useMemo(
    () =>
      showRaw && rawTextElements.length > 0 ? (
        <Content
          style={{
            width,
            height,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}
        >
          <Text style={{ width, height, overflow: 'scroll' }}>
            {rawTextElements}
          </Text>
        </Content>
      ) : record ? (
        <RecordView record={record} width={width} height={height} />
      ) : requestedAccession !== '' ? (
        <p style={{ fontWeight: 'bolder', fontSize: 'larger' }}>
          No database entry found for "{requestedAccession}"
        </p>
      ) : undefined,
    [showRaw, rawTextElements, width, height, record, requestedAccession],
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
