import './ContentChart.scss';

import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { splitStringAndCapitaliseFirstLetter } from '../../../../utils/stringUtils';
import calculateColour from '../../../../utils/calculateColour';
import ValueCount from '../../../../types/ValueCount';
import Content from '../../../../types/Content';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const options: any = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 10,
        padding: 5,
        font: {
          size: 10,
        },
      },
      align: 'center',
    },
  },
};

type InputProps = {
  content: Content;
  identifier: string;
  width: number;
};

function ContentChart({ content, identifier, width }: InputProps) {
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

    contentValueCounts.splice(10);

    const labels = contentValueCounts.map(
      (vc) => vc.value + ' (' + vc.percentage.toPrecision(3) + '%)',
    );
    const counts = contentValueCounts.map((vc) => vc.count);

    const finalData = {
      labels: labels,
      datasets: [
        {
          data: counts,
          backgroundColor: labels.map((l, i) =>
            calculateColour(0, labels.length, i),
          ),
          borderColor: 'black',
          borderWidth: 1,
          dataVisibility: new Array(contentValueCounts.length).fill(true),
        },
      ],
    };

    return (
      <div
        className="content-chart-container"
        style={{
          width,
        }}
      >
        <p className="content-chart-label">
          {(itemCount > 10 ? 'Top 10 of ' : '') +
            splitStringAndCapitaliseFirstLetter(identifier, '_', ' ')}
        </p>
        <Doughnut
          data={finalData}
          options={options}
          fallbackContent={<p>{`No content for ${identifier}`}</p>}
          style={{ padding: '5px' }}
        />
      </div>
    );
  }, [content, identifier, width]);

  return chart;
}

export default ContentChart;
