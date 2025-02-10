import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import PeakSearchRow from './PeakSearchRow';
import { Button, Col, Row } from 'antd';
import { MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import SearchFields from '../../../../../../types/filterOptions/SearchFields';
import PeakSearchPeakType from '../../../../../../types/filterOptions/PeakSearchPeakType';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { Content } from 'antd/es/layout/layout';

function PeakSearch(): JSX.Element {
  const formInstance = useFormInstance<SearchFields>();
  const { getFieldValue, setFieldValue } = formInstance;
  const [peakSearchRows, setPeakSearchRows] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const p = getFieldValue([
      'spectralSearchFilterOptions',
      'peaks',
      'peaks',
    ]) as PeakSearchPeakType[] | undefined;

    if (p && p.length > 0) {
      setPeakSearchRows(
        p.map((_, i) => (
          <PeakSearchRow index={i} key={'peak-search-row-' + i} />
        )),
      );
    } else {
      setPeakSearchRows([
        <PeakSearchRow index={0} key={'peak-search-row-0'} />,
      ]);
    }
  }, [getFieldValue]);

  const handleOnDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (peakSearchRows.length > 1) {
        const peaks = getFieldValue([
          'spectralSearchFilterOptions',
          'peaks',
          'peaks',
        ]) as PeakSearchPeakType[] | undefined;

        if (peaks && peakSearchRows.length === peaks.length) {
          peaks.pop();

          setFieldValue(
            ['spectralSearchFilterOptions', 'peaks', 'peaks'],
            peaks,
          );
        }

        const _rows = [...peakSearchRows];
        _rows.pop();
        setPeakSearchRows(_rows);
      } else {
        setFieldValue(['spectralSearchFilterOptions', 'peaks', 'peaks'], []);
        setPeakSearchRows([
          <PeakSearchRow index={0} key={'peak-search-row-0'} />,
        ]);
      }
    },
    [getFieldValue, peakSearchRows, setFieldValue],
  );

  const handleOnAdd = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const index = peakSearchRows.length;
      setPeakSearchRows([
        ...peakSearchRows,
        <PeakSearchRow index={index} key={'peak-search-row-' + index} />,
      ]);
    },
    [peakSearchRows],
  );

  const peakSearch: JSX.Element = useMemo(() => {
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
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
        }}
      >
        <Row key="peak-search-header">
          <Col span={4}>Peak</Col>
          <Col span={9}>Mass</Col>
          <Col span={4}></Col>
          <Col span={7}>Formula</Col>
        </Row>
        {rows}
      </Content>
    );
  }, [handleOnAdd, handleOnDelete, peakSearchRows]);

  return peakSearch;
}

export default PeakSearch;
