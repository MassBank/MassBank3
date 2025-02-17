import { Segmented as SegmentedAntD } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { SegmentedOptions } from 'antd/es/segmented';
import {
  createRef,
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useContainerDimensions from '../../utils/useContainerDimensions';
import useIsVisible from '../../utils/useIsVisible';

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
  const { width: segmentedWidth } = useContainerDimensions(ref);
  const [activeSegment, setActiveSegment] = useState<string | undefined>();

  const elementRefs = useMemo(
    () => elements.map(() => createRef<HTMLDivElement>()),
    [elements],
  );
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
      elementRefs[index].current?.scrollIntoView({
        behavior: 'smooth',
      });
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
            height,
          }}
        />
        <Content
          style={{
            width: `calc(100% - ${segmentedWidth})`,
            height: '100%',
            display: 'block',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'scroll',
          }}
        >
          {elements.map((element, index) => (
            <Content
              key={index}
              ref={elementRefs[index]}
              style={{
                width: `calc(100% - ${segmentedWidth})`,
              }}
            >
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
      segmentedWidth,
      width,
    ],
  );
}

export default Segmented;
