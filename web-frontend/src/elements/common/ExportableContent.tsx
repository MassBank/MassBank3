import { Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import {
  CopyOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  CSSProperties,
  JSX,
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import useContainerDimensions from '../../utils/useContainerDimensions';

const defaultButtonWidth = 25;
const defaultButtonHeight = 25;
const marginLeftButtonsContainer = 15;
const marginLeftSearchButton = 10;

const toolButtonStyle: CSSProperties = {
  width: defaultButtonWidth,
  height: defaultButtonHeight,
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  border: 'none',
  boxShadow: 'none',
  backgroundColor: 'rgb(225, 231, 245)',
};

interface InputProps {
  title: string;
  mode: 'copy' | 'download';
  onClick: () => void;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  style?: CSSProperties;
  component?: JSX.Element | string;
  componentContainerStyle?: CSSProperties;
  buttonContainerStyle?: CSSProperties;
  permanentButton?: boolean;
  enableSearch?: boolean;
  searchUrl?: string;
  searchTitle?: string;
}

function ExportableContent({
  title,
  mode,
  onClick,
  style = {},
  width = '100%',
  height = '100%',
  component,
  componentContainerStyle = {},
  buttonContainerStyle = {},
  permanentButton = false,
  enableSearch = false,
  searchUrl = '',
  searchTitle = '',
}: InputProps) {
  const componentContainerRef = useRef<HTMLDivElement>(null);
  const { width: componentWidth } = useContainerDimensions(
    componentContainerRef,
  );
  const [showButton, setShowButton] = useState<boolean>(false);

  const handleOnClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    },
    [onClick],
  );

  return useMemo(
    () => (
      <Content
        style={{
          ...{
            minWidth: width,
            maxWidth: width,
            minHeight: height,
            maxHeight: height,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          ...style,
        }}
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
      >
        {component && (
          <div
            ref={componentContainerRef}
            style={{
              ...{
                minHeight: height,
                maxHeight: height,
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
              },
              ...componentContainerStyle,
            }}
          >
            {component}
          </div>
        )}
        <Content
          style={{
            ...{
              minWidth: enableSearch
                ? 2 * defaultButtonWidth +
                  marginLeftSearchButton +
                  marginLeftButtonsContainer
                : defaultButtonWidth + marginLeftButtonsContainer,
              maxWidth: `calc(100% - ${componentWidth})`,
              marginLeft: marginLeftButtonsContainer,
              minHeight: defaultButtonHeight,
              maxHeight: defaultButtonHeight,
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
            },
            ...buttonContainerStyle,
          }}
        >
          <Button
            children={
              mode === 'copy' ? (
                <CopyOutlined title={title} />
              ) : (
                <DownloadOutlined title={title} />
              )
            }
            onClick={handleOnClick}
            style={{
              ...toolButtonStyle,
              display: permanentButton
                ? undefined
                : showButton
                  ? undefined
                  : 'none',
            }}
          />
          {enableSearch && (
            <Button
              children={
                <a
                  href={searchUrl && searchUrl !== '' ? searchUrl : '?'}
                  target="_blank"
                >
                  <SearchOutlined title={searchTitle} />
                </a>
              }
              style={{
                ...toolButtonStyle,
                marginLeft: marginLeftSearchButton,
                display: permanentButton
                  ? undefined
                  : showButton
                    ? undefined
                    : 'none',
              }}
            />
          )}
        </Content>
      </Content>
    ),
    [
      buttonContainerStyle,
      component,
      componentContainerStyle,
      componentWidth,
      enableSearch,
      handleOnClick,
      height,
      mode,
      permanentButton,
      searchTitle,
      searchUrl,
      showButton,
      style,
      title,
      width,
    ],
  );
}

export default ExportableContent;
