import './ContentChart.scss';

import { useMemo } from 'react';
import {
  splitStringAndCapitaliseFirstLetter,
  splitStringAndJoin,
} from '../../../../utils/stringUtils';
import ValueCount from '../../../../types/ValueCount';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Pie } from '@ant-design/plots';
import { Content } from 'antd/es/layout/layout';

type InputProps = {
  content: ContentFilterOptions;
  identifier: string;
  width: number;
  height: number;
};

function ContentChart({ content, identifier, width, height }: InputProps) {
  const topN = 10;

  const chart = useMemo(() => {
    const filteredValueCounts = [
      ...(content[identifier] as ValueCount[]),
    ].filter((vc) => vc.flag === true);
    const itemCount = filteredValueCounts.length;
    const totalCount =
      filteredValueCounts.length > 0
        ? filteredValueCounts
            .map((vc) => vc.count)
            .reduce((accu, count) => accu + count)
        : undefined;

    const contentValueCounts = filteredValueCounts
      .sort((vc1, vc2) => -1 * (vc1.count - vc2.count))
      .map((vc) => {
        return {
          ...vc,
          percentage:
            totalCount !== undefined ? (vc.count / totalCount) * 100 : 0,
        };
      });

    contentValueCounts.splice(topN);

    const labels = contentValueCounts.map(
      (vc) =>
        splitStringAndJoin(vc.value, '_', ' ') +
        ' (' +
        vc.percentage.toPrecision(3) +
        '%)',
    );
    const counts = contentValueCounts.map((vc) => vc.count);

    const data = labels.map((label, i) => {
      return {
        type: label,
        value: counts[i],
      };
    });

    const config = {
      data,
      angleField: 'value',
      colorField: 'type',
      innerRadius: 0.3,
      label: {
        text: 'type',
        position: 'outside',
      },
      legend: false,
      width,
      height: height - 20,
      padding: 10,
    };

    return (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            width,
            height: 20,
            margin: 0,
            marginTop: 5,
            fontWeight: 'bolder',
          }}
        >
          {(itemCount > topN ? 'Top ' + topN + ' of ' : '') +
            splitStringAndCapitaliseFirstLetter(identifier, '_', ' ')}
        </p>
        <Pie {...config} />
      </Content>
    );
  }, [content, height, identifier, width]);

  return useMemo(
    () => (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {chart}
      </Content>
    ),
    [chart, height, width],
  );
}

export default ContentChart;
