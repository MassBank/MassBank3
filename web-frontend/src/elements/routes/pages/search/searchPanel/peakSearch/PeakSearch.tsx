import {
  JSX,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PeakSearchRow from './PeakSearchRow';
import { Button, Col, Row } from 'antd';
import {
  MinusCircleFilled,
  PlusCircleFilled,
  QuestionCircleTwoTone,
} from '@ant-design/icons';
import SearchFields from '../../../../../../types/filterOptions/SearchFields';
import PeakSearchPeakType from '../../../../../../types/filterOptions/PeakSearchPeakType';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { Content } from 'antd/es/layout/layout';
import Tooltip from '../../../../../basic/Tooltip';

type peaks = ['spectralSearchFilterOptions', 'peaks', 'peaks'];
type neutralLoss = [
  'spectralSearchFilterOptions',
  'neutralLoss',
  'neutralLosses',
];

type InputProps = {
  type: 'peaks' | 'neutralLoss';
};

function PeakSearch({ type }: InputProps): JSX.Element {
  const formInstance = useFormInstance<SearchFields>();
  const { getFieldValue, setFieldValue } = formInstance;
  const [peakSearchRows, setPeakSearchRows] = useState<JSX.Element[]>([]);
  const [fieldName, setFieldName] = useState<peaks | neutralLoss>();

  useEffect(() => {
    const _fieldName: peaks | neutralLoss =
      type === 'peaks'
        ? ['spectralSearchFilterOptions', 'peaks', 'peaks']
        : ['spectralSearchFilterOptions', 'neutralLoss', 'neutralLosses'];
    setFieldName(_fieldName);

    const p = getFieldValue(_fieldName) as PeakSearchPeakType[] | undefined;

    if (p && p.length > 0) {
      setPeakSearchRows(
        p.map((_, i) => (
          <PeakSearchRow index={i} type={type} key={'peak-search-row-' + i} />
        )),
      );
    } else {
      setPeakSearchRows([
        <PeakSearchRow index={0} type={type} key={'peak-search-row-0'} />,
      ]);
    }
  }, [getFieldValue, type]);

  const handleOnDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (peakSearchRows.length > 1) {
        const peaks = getFieldValue(fieldName) as
          | PeakSearchPeakType[]
          | undefined;

        if (peaks && peakSearchRows.length === peaks.length) {
          peaks.pop();

          setFieldValue(fieldName, peaks);
        }

        const _rows = [...peakSearchRows];
        _rows.pop();
        setPeakSearchRows(_rows);
      } else {
        setFieldValue(fieldName, []);
        setPeakSearchRows([
          <PeakSearchRow index={0} type={type} key={'peak-search-row-0'} />,
        ]);
      }
    },
    [fieldName, getFieldValue, peakSearchRows, setFieldValue, type],
  );

  const handleOnAdd = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const index = peakSearchRows.length;
      setPeakSearchRows([
        ...peakSearchRows,
        <PeakSearchRow
          index={index}
          type={type}
          key={'peak-search-row-' + index}
        />,
      ]);
    },
    [peakSearchRows, type],
  );

  return useMemo(() => {
    const rows = peakSearchRows.concat([
      <Row
        key={'peak-search-row-' + peakSearchRows.length}
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}
      >
        <Col span={4}></Col>
        <Col span={9}>
          <Button
            children={
              <PlusCircleFilled
                title={'Add a new m/z value'}
                style={{ color: 'green' }}
              />
            }
            onClick={handleOnAdd}
            style={{
              width: 10,
              height: '100%',
              border: 'none',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          />
        </Col>
        <Col span={4}></Col>
        <Col span={7}>
          <Button
            children={
              <MinusCircleFilled
                title={'Remove last m/z value'}
                style={{ color: 'red' }}
              />
            }
            onClick={handleOnDelete}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          />
        </Col>
      </Row>,
    ]);

    return (
      <Content
        key={'peak-search-content-' + type}
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Content style={{ width: 'calc(100% - 25px)' }}>
          <Row key="peak-search-header">
            <Col span={4}>{type === 'peaks' ? 'Peak' : 'Loss'}</Col>
            <Col span={9}>Mass</Col>
            <Col span={4}></Col>
            <Col span={7}>Formula</Col>
          </Row>
          {rows}
        </Content>
        <Tooltip
          title={`Search by ${type === 'peaks' ? 'specific masses' : 'peak differences (neutral losses)'}. Every row represents a single ${type === 'peaks' ? 'peak' : 'neutral loss'} and needs to be present in a database record. Masses are calculated automatically by entering a valid molecular formula (e.g. CH3) in the formula field.`}
        >
          <QuestionCircleTwoTone
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '25px',
            }}
          />
        </Tooltip>
      </Content>
    );
  }, [handleOnAdd, handleOnDelete, peakSearchRows, type]);
}

export default PeakSearch;
