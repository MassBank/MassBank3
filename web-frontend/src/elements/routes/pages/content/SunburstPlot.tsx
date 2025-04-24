import { useCallback, useMemo } from 'react';
import Plot, { PlotParams } from 'react-plotly.js';
import ClassificationData from '../../../../types/ClassificationData';
import filterClassificationData from '../../../../utils/filterClassificationData';

const colorOptions = ['lightgreen', 'orange', 'red', 'purple'];

type InputProps = {
  data: ClassificationData | null;
  onSelect: (selectedLabels: string[]) => void;
  width: number;
  height: number;
};

function SunburstPlot({ data, onSelect, width, height }: InputProps) {
  const handleOnClick = useCallback(
    (e: Plotly.PlotMouseEvent) => {
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const label = (e.points[0] as any).label as string;
        // const selectedData = filterClassificationData(label, data);
        const selectedLabels: string[] = [label];
        if (data.hashmapParents.get(label) !== undefined) {
          const parent = data.hashmapParents.get(label);
          if (parent !== undefined) {
            selectedLabels.unshift(
              parent === '' ? 'Chemical compounds' : parent,
            );
            const parent2 = data.hashmapParents.get(parent);
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
        insidetextorientation: 'radial',
        branchvalues: 'total',
        marker: {
          colors,
        },
        hovertemplate:
          '%{label}<br>%{value} (%{percentEntry:.2%})<extra></extra>',
      },
    ];

    return (
      <Plot
        data={plotData}
        layout={{
          width,
          height,
          margin: { l: 0, r: 0, b: 0, t: 0 },
        }}
        onClick={handleOnClick}
      />
    );
  }, [data, handleOnClick, height, width]);
}

export default SunburstPlot;
