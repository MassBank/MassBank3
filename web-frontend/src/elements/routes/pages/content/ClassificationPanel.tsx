import { Content } from 'antd/es/layout/layout';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  const [selectedClassification, setSelectedClassification] =
    useState<ClassificationData | null>(null);

  const [selectedClassificationLabels, setSelectedClassificationLabels] =
    useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setSelectedClassification(data);
    }
  }, [data]);

  const handleOnSelectTreeNode = useCallback(
    (selectedData: ClassificationData) =>
      setSelectedClassification(selectedData),
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
            data={selectedClassification}
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
      selectedClassification,
      selectedClassificationLabels,
      width,
    ],
  );
}

export default ClassificationPanel;
