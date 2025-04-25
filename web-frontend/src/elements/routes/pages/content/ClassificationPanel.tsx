import { Content } from 'antd/es/layout/layout';
import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import ClassificationTree from './ClassificationTree';
import ClassificationData from '../../../../types/ClassificationData';
import { Spin } from 'antd';

const SunburstPlot = lazy(() => import('./SunburstPlot'));

type InputProps = {
  data: ClassificationData;
  width: number;
  height: number;
};

function ClassificationPanel({ data, width, height }: InputProps) {
  const [selectedClassificationLabels, setSelectedClassificationLabels] =
    useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(
    undefined,
  );

  const handleOnSelectTreeNode = useCallback(
    (level: string) => setSelectedLevel(level),
    [],
  );

  const handleOnSelectPlot = useCallback(
    (selectedLabels: string[]) =>
      setSelectedClassificationLabels(selectedLabels),
    [],
  );

  return useMemo(
    () => (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: 20,
        }}
      >
        <ClassificationTree
          data={data}
          onSelect={handleOnSelectTreeNode}
          width={width / 3}
          height={height}
          selectedExpandedKeys={selectedClassificationLabels}
        />
        <Suspense fallback={<Spin size="large" spinning />}>
          <SunburstPlot
            data={data}
            level={selectedLevel}
            onSelect={handleOnSelectPlot}
            width={(width / 3) * 2}
            height={height}
          />
        </Suspense>
      </Content>
    ),
    [
      data,
      handleOnSelectPlot,
      handleOnSelectTreeNode,
      height,
      selectedClassificationLabels,
      selectedLevel,
      width,
    ],
  );
}

export default ClassificationPanel;
