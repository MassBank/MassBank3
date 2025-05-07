import { ChangeEvent, useCallback, useMemo } from 'react';
import calculateMolecularMass from '../../../../../../utils/mass/calculateMolecularMass';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SearchFields from '../../../../../../types/filterOptions/SearchFields';
import PeakSearchPeakType from '../../../../../../types/filterOptions/PeakSearchPeakType';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

type InputProps = {
  index: number;
  type: 'peaks' | 'neutralLoss';
};

function PeakSearchRow({ index, type }: InputProps) {
  const formInstance = useFormInstance<SearchFields>();
  const { getFieldValue, setFieldValue } = formInstance;

  const handleOnChangeMass = useCallback(() => {
    setFieldValue(
      type === 'peaks'
        ? ['spectralSearchFilterOptions', 'peaks', 'peaks', index, 'formula']
        : [
            'spectralSearchFilterOptions',
            'neutralLoss',
            'neutralLosses',
            index,
            'formula',
          ],
      undefined,
    );
  }, [index, setFieldValue, type]);

  const handleOnChangeFormula = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const formula = e.target.value;
      const mass = calculateMolecularMass(formula);
      const peaks = (getFieldValue(
        type === 'peaks'
          ? ['spectralSearchFilterOptions', 'peaks', 'peaks']
          : ['spectralSearchFilterOptions', 'neutralLoss', 'neutralLosses'],
      ) || []) as PeakSearchPeakType[];
      const value = mass > 0 ? mass : undefined;
      if (index >= 0 && index < peaks.length) {
        peaks[index] = { mz: value, formula };
      } else {
        peaks.push({ mz: value, formula });
      }
      setFieldValue(
        type === 'peaks'
          ? ['spectralSearchFilterOptions', 'peaks', 'peaks']
          : ['spectralSearchFilterOptions', 'neutralLoss', 'neutralLosses'],
        peaks,
      );
    },
    [getFieldValue, index, setFieldValue, type],
  );

  return useMemo(
    () => (
      <Row
        key={'peak-search-row-' + index}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Col span={4}>{index + 1}</Col>
        <Col span={9}>
          <Form.Item<SearchFields>
            name={
              type === 'peaks'
                ? ['spectralSearchFilterOptions', 'peaks', 'peaks', index, 'mz']
                : [
                    'spectralSearchFilterOptions',
                    'neutralLoss',
                    'neutralLosses',
                    index,
                    'mz',
                  ]
            }
            rules={[{ required: false }]}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <InputNumber
              key={`peak-search-row-${index}-mz-input`}
              min={0}
              step={0.01}
              onChange={handleOnChangeMass}
              style={{ width: '100%', height: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <ArrowLeftOutlined />
        </Col>
        <Col span={7}>
          <Form.Item<SearchFields>
            name={
              type === 'peaks'
                ? [
                    'spectralSearchFilterOptions',
                    'peaks',
                    'peaks',
                    index,
                    'formula',
                  ]
                : [
                    'spectralSearchFilterOptions',
                    'neutralLoss',
                    'neutralLosses',
                    index,
                    'formula',
                  ]
            }
            rules={[{ required: false }]}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <Input
              key={`peak-search-row-${index}-formula-input`}
              type="text"
              onChange={handleOnChangeFormula}
              style={{ width: '100%', height: '100%' }}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
    ),
    [handleOnChangeFormula, handleOnChangeMass, index, type],
  );
}

export default PeakSearchRow;
