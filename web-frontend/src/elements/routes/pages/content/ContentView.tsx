import './ContentView.scss';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Spinner from '../../../basic/Spinner';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Content from '../../../../types/Content';
import ValueCount from '../../../../types/ValueCount';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import {
  splitStringAndCapitaliseFirstLetter,
  splitStringAndJoin,
} from '../../../../utils/stringUtils';

function ContentView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [recordCount, setRecordCount] = useState<number | undefined>();
  const [content, setContent] = useState<Content | undefined>();

  async function getRecordCount() {
    const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/count';
    const resp = await fetch(url);
    if (resp.ok) {
      return await resp.json();
    } else {
      return undefined;
    }
  }

  async function getBrowseOptions() {
    const url = import.meta.env.VITE_MB3_API_URL + '/v1/filter/browse';
    const resp = await fetch(url);
    if (resp.ok) {
      const jsonData = await resp.json();

      if (typeof jsonData === 'string') {
        return undefined;
      }

      return jsonData;
    }

    return undefined;
  }

  const handleOnFetch = useCallback(async () => {
    setIsRequesting(true);

    const count: number | undefined = await getRecordCount();
    const _content = await getBrowseOptions();
    console.log(_content);

    setRecordCount(count);
    setContent(_content);
    setIsRequesting(false);
  }, []);

  useEffect(() => {
    handleOnFetch();
  }, [handleOnFetch]);

  Chart.register(ArcElement, Tooltip, Legend);

  function calcColor(min: number, max: number, val: number) {
    const minHue = 240;
    const maxHue = 0;
    var curPercent = (val - min) / (max - min);
    var colString =
      'hsl(' + (curPercent * (maxHue - minHue) + minHue) + ',100%,50%)';
    return colString;
  }

  const charts = useMemo(() => {
    if (content) {
      const keys = Object.keys(content).filter((key) => key !== 'metadata');
      const _charts = keys.map((key) => {
        const itemCount = (content[key] as ValueCount[]).length;
        const totalCount = (content[key] as ValueCount[])
          .map((vc) => vc.count)
          .reduce((accu, count) => accu + count);

        const contentValueCounts = (content[key] as ValueCount[])
          .sort((vc1, vc2) => -1 * (vc1.count - vc2.count))
          .map((vc) => {
            return { ...vc, percentage: (vc.count / totalCount) * 100 };
          });

        contentValueCounts.splice(10);

        const labels = contentValueCounts.map(
          (vc) => vc.value + ' (' + vc.percentage.toPrecision(3) + '%)',
        );
        const counts = contentValueCounts.map((vc) => vc.count);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: any = {
          plugins: {
            responsive: true,
            legend: {
              display: true,
              responsive: true,
              position: 'top',
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
        const finalData = {
          labels: labels,
          datasets: [
            {
              data: counts,
              backgroundColor: labels.map((l, i) =>
                calcColor(0, labels.length, i),
              ),
              borderColor: 'black',
              borderWidth: 1,
              dataVisibility: new Array(contentValueCounts.length).fill(true),
            },
          ],
        };

        return (
          <div
            key={'chart_' + key}
            className="content-chart"
            style={{
              width: width / 4,
              border: 'solid 1px black',
            }}
          >
            <p>
              {(itemCount > 10 ? 'Top 10 of ' : '') +
                splitStringAndCapitaliseFirstLetter(key, '_', ' ')}
            </p>
            <Doughnut
              data={finalData}
              options={options}
              fallbackContent={<p>{`No content for ${key}`}</p>}
            />
          </div>
        );
      });

      return (
        <div
          className="content-charts"
          style={{
            width,
            height,
          }}
        >
          {_charts}
        </div>
      );
    }

    return undefined;
  }, [content, height, width]);

  const contentTable = useMemo(() => {
    if (content) {
      const keys = Object.keys(content).filter((key) => key !== 'metadata');

      const header = (
        <tr key={'content-table-header'}>
          <th>Category</th>
          <th>Value</th>
          <th>Count</th>
          <th>Share (%)</th>
        </tr>
      );

      const rows: JSX.Element[] = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const totalCount = (content[key] as ValueCount[])
          .map((vc) => vc.count)
          .reduce((accu, count) => accu + count);
        const contentValueCounts = (content[key] as ValueCount[])
          .sort((vc1, vc2) => -1 * (vc1.count - vc2.count))
          .map((vc) => {
            return { ...vc, percentage: (vc.count / totalCount) * 100 };
          });

        contentValueCounts.forEach((vc, k) => {
          rows.push(
            <tr key={'content-table-row-' + key + '-' + i + '-' + k}>
              <td>{splitStringAndCapitaliseFirstLetter(key, '_', ' ')}</td>
              <td>{splitStringAndJoin(vc.value, '_', ' ')}</td>
              <td>{vc.count}</td>
              <td>{vc.percentage.toPrecision(3)}</td>
            </tr>,
          );
        });
      }

      return (
        <div className="content-table-container">
          <table className="content-table">
            <thead>{header}</thead>
            <tbody>
              {rows}
              <tr className="auto-height" />
            </tbody>
          </table>
        </div>
      );
    }

    return undefined;
  }, [content]);

  return (
    <div ref={ref} className="content-view">
      {isRequesting ? (
        <Spinner buttonDisabled buttonStyle={{ display: 'none' }} />
      ) : (
        <div className="content-container">
          <h2>
            {recordCount
              ? `MassBank has ${recordCount} entries!`
              : 'Could not fetch record count!'}
          </h2>

          {charts}
          {contentTable}
        </div>
      )}
    </div>
  );
}

export default ContentView;
