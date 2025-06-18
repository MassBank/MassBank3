import { useCallback, useMemo } from 'react';
import Plot, { PlotParams } from 'react-plotly.js';
import ClassificationData from '../../../../types/ClassificationData';

const colorOptions = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'];

type InputProps = {
  data: ClassificationData | null;
  width: number;
  height: number;
  onSelect?: (selectedLabels: string[]) => void;
  level?: string;
};

function SunburstPlot({ data, onSelect, width, height, level }: InputProps) {
  const handleOnClick = useCallback(
    (e: Plotly.PlotMouseEvent) => {
      if (data && onSelect) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const label = (e.points[0] as any).label as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entry = (e.points[0] as any).entry as string;
        const selectedLabels: string[] =
          entry === label || entry === undefined ? [] : [label];
        if (data.hashmapParents.get(label) !== undefined) {
          const parent1 = data.hashmapParents.get(label);
          if (parent1 !== undefined) {
            selectedLabels.unshift(
              parent1 === '' ? 'Chemical compounds' : parent1,
            );
            const parent2 = data.hashmapParents.get(parent1);
            if (parent2 !== undefined) {
              selectedLabels.unshift(
                parent2 === '' ? 'Chemical compounds' : parent2,
              );
              const parent3 = data.hashmapParents.get(parent2);
              if (parent3 !== undefined) {
                selectedLabels.unshift(
                  parent3 === '' ? 'Chemical compounds' : parent3,
                );
                const parent4 = data.hashmapParents.get(parent3);
                if (parent4 !== undefined) {
                  selectedLabels.unshift(
                    parent4 === '' ? 'Chemical compounds' : parent4,
                  );
                }
              }
            }
          }
        }
        onSelect(selectedLabels);
      }
    },
    [data, onSelect],
  );

  return useMemo(() => {
    if (!data) {
      return null;
    }
    const colors: string[] = [];
    data.labels.forEach((label) => {
      const level = data.hashmapLevels.get(label)!;
      colors.push(colorOptions[level]);
    });
    const plotData: PlotParams['data'] = [
      {
        type: 'sunburst',
        labels: data.labels,
        parents: data.parents,
        values: data.values,
        level,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        insidetextorientation: 'radial',
        branchvalues: 'total',
        marker: {
          colors,
        },
        hovertemplate:
          '%{label}<br>%{value} (%{percentEntry:.2%})<extra></extra>',
      },
    ];
    const layout: PlotParams['layout'] = {
      width,
      height,
      margin: { l: 0, r: 0, b: 0, t: 0 },
    };

    return <Plot data={plotData} layout={layout} onClick={handleOnClick} />;
  }, [data, handleOnClick, height, level, width]);
}

export default SunburstPlot;
