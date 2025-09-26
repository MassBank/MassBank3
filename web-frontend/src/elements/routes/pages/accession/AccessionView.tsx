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

  const notFoundElement = useMemo(
    () => (
      <div
        key={'no-record-found-' + requestedAccession}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p style={{ fontWeight: 'bolder', fontSize: 'larger' }}>
          No database entry found for "{requestedAccession}".
        </p>
      </div>
    ),
    [requestedAccession],
  );

  const handleOnSearch = useCallback(
    async (acc: string, raw: boolean) => {
      setIsRequesting(true);
      setRequestedAccession(acc);

      if (raw) {
        let _rawTextElements: JSX.Element[] = [];
        try {
          const rawMassBankRecordText = await fetchRawMassBankRecord(
            exportServiceUrl,
            acc,
          );
          if (rawMassBankRecordText) {
            _rawTextElements = (rawMassBankRecordText as string)
              .split(/\n/g)
              .map((line: string, i: number) => (
                <label key={line + '_' + i}>
                  {line}
                  <br />
                </label>
              ));
          } else {
            _rawTextElements = [notFoundElement];
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // console.error('Error fetching raw MassBank record:', error);
          _rawTextElements = [notFoundElement];
        }
        setRawTextElements(_rawTextElements);
      } else {
        setRecord(await getRecord(acc, backendUrl));
      }

      setIsRequesting(false);
    },
    [backendUrl, exportServiceUrl, notFoundElement],
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
          }}
        >
          <Text
            style={{
              width,
              height,
              overflow: 'scroll',
              padding: 10,
              backgroundColor: 'white',
            }}
          >
            {rawTextElements}
          </Text>
        </Content>
      ) : record ? (
        <RecordView record={record} width={width} height={height} />
      ) : requestedAccession !== '' ? (
        notFoundElement
      ) : undefined,
    [
      showRaw,
      rawTextElements,
      width,
      height,
      record,
      requestedAccession,
      notFoundElement,
    ],
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
