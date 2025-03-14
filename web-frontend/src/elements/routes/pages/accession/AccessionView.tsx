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
import NeutralLoss from '../../../../types/peak/NeutralLoss';

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
    async (acc: string, neutralLossPeakPairsString: string | null) => {
      setIsRequesting(true);
      setRequestedAccession(acc);

      const _record = await searchAccession(acc, backendUrl);
      if (
        _record &&
        neutralLossPeakPairsString &&
        neutralLossPeakPairsString !== ''
      ) {
        const neutralLossPeakPairs = neutralLossPeakPairsString
          ? neutralLossPeakPairsString.split(',')
          : [];
        const _neutralLossPeakPairs = neutralLossPeakPairs.map((nlp) => {
          const [peak1_id, peak2_id] = nlp.split('_').map((p) => 'peak-' + p);
          return { peak1_id, peak2_id };
        });
        const neutralLossData: NeutralLoss[] = [];
        for (const nlp of _neutralLossPeakPairs) {
          const peak1 = _record.peak.peak.values.find(
            (p) => p.id === nlp.peak1_id,
          );
          const peak2 = _record.peak.peak.values.find(
            (p) => p.id === nlp.peak2_id,
          );
          if (peak1 && peak2) {
            const difference = Math.abs(peak1.mz - peak2.mz);
            neutralLossData.push({
              peak1_id: peak1.id,
              peak2_id: peak2.id,
              difference,
            });
          }
        }
        _record.peak.neutral_loss = neutralLossData;
      }
      setRecord(_record);

      setIsRequesting(false);
    },
    [backendUrl],
  );

  useEffect(() => {
    const _accession = searchParams.get('id');
    setAccession(_accession);
    const neutralLossPeakPairsString = searchParams.get('neutralLossPeakPairs');

    if (_accession) {
      handleOnSearch(_accession, neutralLossPeakPairsString);
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
