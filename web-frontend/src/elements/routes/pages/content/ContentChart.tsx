import './ContentChart.scss';

import { CSSProperties, useMemo } from 'react';
import {
  splitStringAndCapitaliseFirstLetter,
  splitStringAndJoin,
} from '../../../../utils/stringUtils';
import ValueCount from '../../../../types/ValueCount';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { Content } from 'antd/es/layout/layout';
import {
  Chart as ChartJS,
  ArcElement,
  Colors,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Colors, Legend, Title, Tooltip);

type InputProps = {
  content: ContentFilterOptions;
  identifier: string;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
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

    const data = {
      labels,
      datasets: [
        {
          data: labels.map((_, i) => counts[i]),
        },
      ],
    };

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
        <Doughnut
          data={data}
          width={width}
          height={height}
          options={{
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
              title: {
                display: true,
                text:
                  (itemCount > topN ? 'Top ' + topN + ' of ' : '') +
                  splitStringAndCapitaliseFirstLetter(identifier, '_', ' '),
                fullSize: true,
                font: {
                  size: 18,
                  weight: 'bold',
                },
              },
              legend: {
                display: true,
                position: 'right',
              },
            },
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
