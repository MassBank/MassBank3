import { useMemo } from 'react';
import Plot, { PlotParams } from 'react-plotly.js';
import Metadata from '../../../../types/Metadata';

const colorOptions = ['lightgreen', 'orange', 'red', 'purple'];

type InputProps = {
  data: Metadata['compound_class_chemont'];
  width: number;
  height: number;
};

function SunburstPlot({ data, width, height }: InputProps) {
  const plotData: PlotParams['data'] = useMemo(() => {
    const hashmapCounts: Map<string, number> = new Map();
    const hashmapParents: Map<string, string> = new Map();
    const hashmapLevels: Map<string, number> = new Map();
    const labels: string[] = [];

    data.forEach((d) => {
      const split = d.name.split('; ');
      const keys = split.slice(1);

      keys.forEach((key, i) => {
        if (hashmapCounts.has(key)) {
          hashmapCounts.set(key, hashmapCounts.get(key)! + d.count);
        } else {
          labels.push(key);
          hashmapCounts.set(key, d.count);
        }
        if (!hashmapParents.has(key)) {
          if (i > 0) {
            hashmapParents.set(key, keys[i - 1]);
          } else {
            hashmapParents.set(key, '');
          }
        }
        if (!hashmapLevels.has(key)) {
          hashmapLevels.set(key, i);
        }
      });
    });
    const parents: string[] = [];
    const values: number[] = [];
    labels.forEach((label) => {
      parents.push(hashmapParents.get(label) || '');
      values.push(hashmapCounts.get(label) || 0);
    });
    const colors: string[] = [];
    labels.forEach((label) => {
      const level = hashmapLevels.get(label)!;
      colors.push(colorOptions[level]);
    });

    return [
      {
        type: 'sunburst',
        labels,
        parents,
        values,
        insidetextorientation: 'radial',
        branchvalues: 'total',
        marker: {
          colors,
        },
        hovertemplate:
          '%{label}<br>%{value} (%{percentEntry:.2%})<extra></extra>',
      },
    ];
  }, [data]);

  return useMemo(
    () => (
      <Plot
        data={plotData}
        layout={{
          width,
          height,
          margin: { l: 0, r: 0, b: 0, t: 0 },
        }}
      />
    ),
    [height, plotData, width],
  );
}

export default SunburstPlot;
