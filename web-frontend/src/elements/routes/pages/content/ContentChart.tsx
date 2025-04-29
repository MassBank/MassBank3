import './ContentChart.scss';

import { useMemo } from 'react';
import {
  splitStringAndCapitaliseFirstLetter,
  splitStringAndJoin,
} from '../../../../utils/stringUtils';
import ValueCount from '../../../../types/ValueCount';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Content } from 'antd/es/layout/layout';

import Plot, { PlotParams } from 'react-plotly.js';

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

    const data: PlotParams['data'] = [
      {
        type: 'pie',
        hole: 0.5,
        labels,
        values: labels.map((_, i) => counts[i]),
        textinfo: 'label',
        hoverinfo: 'label',
        insidetextorientation: 'radial',
      },
    ];

    return (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          margin: 0,
        }}
      >
        <Plot
          data={data}
          layout={{
            title: {
              text:
                (itemCount > topN ? 'Top ' + topN + ' of ' : '') +
                splitStringAndCapitaliseFirstLetter(identifier, '_', ' '),
            },
            width,
            height,
            showlegend: false,
          }}
        />
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
