import { faCopy, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { CSSProperties, MouseEvent, useMemo, useState } from 'react';

const defaultButtonWidth = 30;
const defaultButtonHeight = 30;

interface InputProps {
  title: string;
  mode: 'copy' | 'download';
  onClick: (
    // eslint-disable-next-line no-unused-vars
    e: MouseEvent<HTMLDivElement>,
  ) => void;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  component?: JSX.Element | string;
  componentStyle?: CSSProperties;
  buttonStyle?: CSSProperties;
}

function ExportableContent({
  title,
  mode,
  onClick,
  width,
  height,
  component,
  componentStyle = {},
  buttonStyle = {
    minWidth: defaultButtonWidth,
    maxWidth: defaultButtonWidth,
    minHeight: defaultButtonHeight,
    maxHeight: defaultButtonHeight,
  },
}: InputProps) {
  const [showButton, setShowButton] = useState<boolean>(false);

  return useMemo(
    () => (
      <Content
        style={{
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
      >
        {component && (
          <Content
            style={{
              ...{
                minWidth: `calc(${width} - ${buttonStyle.width}px)`,
                maxWidth: `calc(${width} - ${buttonStyle.width}px)`,
                minHeight: height,
                maxHeight: height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
              ...componentStyle,
            }}
          >
            {component}
          </Content>
        )}
        <Content
          style={{
            ...{
              minWidth: defaultButtonWidth,
              maxWidth: defaultButtonWidth,
              minHeight: defaultButtonHeight,
              maxHeight: defaultButtonHeight,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            ...buttonStyle,
          }}
        >
          <Button
            children={
              <FontAwesomeIcon
                icon={mode === 'copy' ? faCopy : faFileArrowDown}
                title={title}
              />
            }
            onClick={onClick}
            style={{
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              border: 'none',
              boxShadow: 'none',
              backgroundColor: 'transparent',
              display: showButton ? undefined : 'none',
            }}
          />
        </Content>
      </Content>
    ),
    [
      buttonStyle,
      component,
      componentStyle,
      height,
      mode,
      onClick,
      showButton,
      title,
      width,
    ],
  );
}

export default ExportableContent;
