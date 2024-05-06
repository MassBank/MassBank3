import './ContentView.scss';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Spinner from '../../../basic/Spinner';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Content from '../../../../types/Content';
import ValueCount from '../../../../types/ValueCount';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import {
  splitStringAndCapitaliseFirstLetter,
  splitStringAndJoin,
} from '../../../../utils/stringUtils';
import SearchParams from '../../../../types/SearchParams';
import CheckBox from '../../../basic/CheckBox';
import calculateColour from '../../../../utils/calculateColour';

function ContentView() {
  const ref = useRef(null);
  const { width, height } = useContainerDimensions(ref);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [recordCount, setRecordCount] = useState<number | undefined>();
  const [content, setContent] = useState<Content | undefined>();

  async function fetchData(url: string, searchParams?: SearchParams) {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.keys(searchParams).forEach((key) => {
        params.append(key, searchParams[key].join(','));
      });
    }
    const resp = await axios.get(url, { params });
    if (resp.status === 200) {
      return await resp.data;
    }
    console.error(resp.statusText);

    return undefined;
  }

  const handleOnFetch = useCallback(async () => {
    setIsRequesting(true);

    const urlRecordCount =
      import.meta.env.VITE_MB3_API_URL + '/v1/records/count';
    const count: number | undefined = await fetchData(urlRecordCount);

    setRecordCount(count);
    setIsRequesting(false);
  }, []);

  function buildSearchParams(cont: Content | undefined) {
    const searchParams: SearchParams = {};
    if (cont) {
      Object.keys(cont)
        .filter((k) => k !== 'metadata')
        .forEach(
          (k) =>
            (searchParams[k] = (cont[k] as ValueCount[])
              .filter((_vc) => _vc.flag === true)
              .map((_vc) => _vc.value)),
        );
    }

    return searchParams;
  }

  function initFlags(cont: Content) {
    const keys = Object.keys(cont).filter((key) => key !== 'metadata');
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      cont[key] = (cont[key] as ValueCount[]).map((vc) => {
        return { ...vc, flag: true };
      });
    }

    return cont;
  }

  const filterContent = useCallback(
    async (prevContent: Content | undefined) => {
      setIsRequesting(true);

      const url = import.meta.env.VITE_MB3_API_URL + '/v1/filter/browse';
      const newContent = (await fetchData(
        url,
        buildSearchParams(prevContent),
      )) as Content;

      if (!prevContent) {
        initFlags(newContent);
        setContent(newContent);
      } else {
        const _prevContent = { ...prevContent };
        const keys = Object.keys(_prevContent).filter(
          (key) => key !== 'metadata',
        );
        keys.forEach((key) => {
          const valueCounts = [...(_prevContent[key] as ValueCount[])];
          if (Object.keys(newContent).includes(key)) {
            valueCounts.forEach((vc) => {
              const _vc = (newContent[key] as ValueCount[]).find(
                (vc2) => vc2.value === vc.value,
              );
              if (_vc) {
                vc.count = _vc.count;
              } else {
                vc.count = 0;
              }
              if (vc.count === 0) {
                vc.flag = false;
              }
            });

            _prevContent[key] = valueCounts;
          } else {
            _prevContent[key] = valueCounts.map((vc) => {
              return { ...vc, count: 0 };
            });
          }
        });

        setContent(_prevContent);
      }

      setIsRequesting(false);
    },
    [],
  );

  const handleOnSelect = useCallback(
    (key: string, value: string, isChecked: boolean) => {
      if (content) {
        const _content = { ...content };
        _content[key] = [...(_content[key] as ValueCount[])].map((vc) =>
          vc.value === value ? { ...vc, flag: isChecked } : vc,
        );

        filterContent(_content);
      }
    },
    [content, filterContent],
  );

  useEffect(() => {
    handleOnFetch();
    filterContent(undefined);
  }, [handleOnFetch, filterContent]);

  Chart.register(ArcElement, Tooltip, Legend);

  const charts = useMemo(() => {
    if (content) {
      const keys = Object.keys(content).filter((key) => key !== 'metadata');
      const _charts = keys.map((key) => {
        const filteredValueCounts = [...(content[key] as ValueCount[])].filter(
          (vc) => vc.flag === true,
        );
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: any = {
          plugins: {
            legend: {
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

  function buildRow(
    key: string,
    i: number,
    k: number,
    valueCounts: ValueCount[],
    elements: JSX.Element[],
  ) {
    return (
      <tr key={'content-table-row-' + key + '-' + i + '-' + k}>
        {k < 4 ? (
          <td
            rowSpan={
              Math.floor(valueCounts.length / 4) +
              (valueCounts.length % 4 === 0 ? 0 : 1)
            }
          >
            {splitStringAndCapitaliseFirstLetter(key, '_', ' ')}
          </td>
        ) : undefined}

        {elements.map((elem, l) => (
          <td key={'elem-' + i + '_' + k + '_' + l}>{elem}</td>
        ))}
      </tr>
    );
  }

  const contentTable = useMemo(() => {
    if (content) {
      const keys = Object.keys(content).filter((key) => key !== 'metadata');

      const header = (
        <tr key={'content-table-header'}>
          <th>Category</th>
          <th colSpan={4}>Value</th>
        </tr>
      );

      const rows: JSX.Element[] = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const totalCount = (content[key] as ValueCount[])
          .map((vc) => vc.count)
          .reduce((accu, count) => accu + count);
        const valueCounts = [...(content[key] as ValueCount[])].map((vc) => {
          return { ...vc, percentage: (vc.count / totalCount) * 100 };
        });

        let elements: JSX.Element[] = [];
        for (let k = 0; k < valueCounts.length; k++) {
          const vc = valueCounts[k];
          elements.push(
            <CheckBox
              defaultValue={vc.flag || false}
              onChange={(isChecked: boolean) =>
                handleOnSelect(key, vc.value, isChecked)
              }
              label={
                splitStringAndJoin(vc.value, '_', ' ') + ' (' + vc.count + ')'
              }
            />,
          );

          if ((k + 1) % 4 === 0) {
            rows.push(buildRow(key, i, k, valueCounts, elements));
            elements = [];
          } else if (k === valueCounts.length - 1) {
            rows.push(buildRow(key, i, k, valueCounts, elements));
          }
        }
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
  }, [content, handleOnSelect]);

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
