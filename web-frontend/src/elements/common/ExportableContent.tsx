import {
  faCopy,
  faFileArrowDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import {
  CSSProperties,
  MouseEvent,
  JSX,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import useContainerDimensions from '../../utils/useContainerDimensions';

const defaultButtonWidth = 20;
const defaultButtonHeight = 20;
const marginLeftButtonsContainer = 15;
const marginLeftSearchButton = 10;

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
              <FontAwesomeIcon
                icon={mode === 'copy' ? faCopy : faFileArrowDown}
                title={title}
                style={{
                  width: defaultButtonWidth,
                  padding: 0,
                  margin: 0,
                }}
              />
            }
            onClick={handleOnClick}
            style={{
              width: defaultButtonWidth,
              height: defaultButtonHeight,
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              border: 'none',
              boxShadow: 'none',
              backgroundColor: 'transparent',
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
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    title={searchTitle}
                    style={{
                      width: defaultButtonWidth,
                      padding: 0,
                      margin: 0,
                    }}
                  />
                </a>
              }
              style={{
                width: defaultButtonWidth,
                height: defaultButtonHeight,
                padding: 0,
                margin: 0,
                marginLeft: marginLeftSearchButton,
                cursor: 'pointer',
                border: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent',
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
