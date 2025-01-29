import { JSX, MouseEvent, useCallback, useMemo, useState } from 'react';
import PeakSearchRow from './PeakSearchRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Row } from 'antd';
import SearchFields from '../../../../../../types/filterOptions/SearchFields';
import PeakSearchPeakType from '../../../../../../types/filterOptions/PeakSearchPeakType';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { Content } from 'antd/es/layout/layout';

function PeakSearch(): JSX.Element {
  const formInstance = useFormInstance<SearchFields>();
  const { getFieldValue, setFieldValue } = formInstance;
  const [peakSearchRows, setPeakSearchRows] = useState<JSX.Element[]>([
    <PeakSearchRow index={0} key={'peak-search-row-0'} />,
  ]);
  const handleOnDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (peakSearchRows.length > 1) {
        const peaks = getFieldValue(['peaks', 'peaks', 'peaks']) as
          | PeakSearchPeakType[]
          | undefined;

        if (peaks) {
          peaks.pop();
        }
        setFieldValue(['peaks', 'peaks', 'peaks'], peaks);
        const _rows = [...peakSearchRows];
        _rows.pop();
        setPeakSearchRows(_rows);
      } else {
        setFieldValue(['peaks', 'peaks', 'peaks'], []);
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
        <Col span={6}></Col>
        <Col span={6}>
          <Button
            children={
              <FontAwesomeIcon
                icon={faPlusCircle}
                title={'Add a new m/z value'}
                color="green"
                size="lg"
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
        <Col span={6}></Col>
        <Col span={6}>
          <Button
            children={
              <FontAwesomeIcon
                icon={faMinusCircle}
                title={'Remove last m/z value'}
                color="red"
                size="lg"
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
          <Col span={6}>Peak</Col>
          <Col span={6}>Mass</Col>
          <Col span={6}></Col>
          <Col span={6}>Formula</Col>
        </Row>
        {rows}
      </Content>
    );
  }, [handleOnAdd, handleOnDelete, peakSearchRows]);

  return peakSearch;
}

export default PeakSearch;
