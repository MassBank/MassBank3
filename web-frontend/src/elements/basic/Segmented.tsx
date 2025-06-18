import './Segmented.scss';

import { Segmented as SegmentedAntD } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { SegmentedOptions } from 'antd/es/segmented';
import {
  createRef,
  CSSProperties,
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useIsVisible from '../../utils/useIsVisible';
import segmentedWidth from '../../constants/segmentedWidth';

type InputProps = {
  elements: (JSX.Element | string)[];
  elementLabels: string[];
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
};

function Segmented({
  elements,
  elementLabels,
  width = '100%',
  height = '100%',
}: InputProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeSegment, setActiveSegment] = useState<string | undefined>();

  const elementRefs = useMemo(
    () => elements.map(() => createRef<HTMLDivElement>()),
    [elements],
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isVisibles = elementRefs.map(useIsVisible);

  useEffect(() => {
    if (isVisibles.some((isVisible) => isVisible)) {
      let index = isVisibles.findIndex((isVisible) => isVisible);
      if (isVisibles[0]) {
        index = 0;
      } else if (isVisibles[isVisibles.length - 1]) {
        index = isVisibles.length - 1;
      }
      setActiveSegment(elementLabels[index]);
    }
  }, [isVisibles, elementLabels]);

  const options: SegmentedOptions<string> = useMemo(() => {
    return elementLabels.map((label) => {
      return {
        label: label,
        value: label,
      };
    });
  }, [elementLabels]);

  const handleOnChange = useCallback(
    (value: string) => {
      const index = elementLabels.indexOf(value);
      elementRefs[index].current?.scrollIntoView();
      setActiveSegment(value);
    },
    [elementLabels, elementRefs],
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
        }}
      >
        <SegmentedAntD<string>
          ref={ref}
          options={options}
          value={activeSegment}
          onChange={handleOnChange}
          vertical
          style={{
            width: segmentedWidth,
            height,
          }}
        />
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'scroll',
            backgroundColor: 'white',
          }}
        >
          {elements.map((element, index) => (
            <Content key={index} ref={elementRefs[index]}>
              {element}
            </Content>
          ))}
        </Content>
      </Content>
    ),
    [
      activeSegment,
      elementRefs,
      elements,
      handleOnChange,
      height,
      options,
      width,
    ],
  );
}

export default Segmented;
