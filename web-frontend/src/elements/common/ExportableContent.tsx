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
  useCallback,
  useMemo,
  useState,
} from 'react';

const defaultButtonWidth = 30;

interface InputProps {
  title: string;
  mode: 'copy' | 'download';
  onClick: () => void;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  style?: CSSProperties;
  component?: JSX.Element | string;
  componentStyle?: CSSProperties;
  buttonStyle?: CSSProperties;
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
  componentStyle = {},
  buttonStyle = {},
  permanentButton = false,
  enableSearch = false,
  searchUrl = '',
  searchTitle = '',
}: InputProps) {
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
          <Content
            style={{
              ...{
                minWidth: width,
                maxWidth: width,
                minHeight: height,
                maxHeight: height,
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                marginRight: enableSearch
                  ? -2 * defaultButtonWidth
                  : -defaultButtonWidth,
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
              minWidth: enableSearch
                ? 2 * defaultButtonWidth
                : defaultButtonWidth,
              maxWidth: enableSearch
                ? 2 * defaultButtonWidth
                : defaultButtonWidth,
              minHeight: height,
              maxHeight: height,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            ...buttonStyle,
          }}
        >
          <Button
            children={
              <a>
                <FontAwesomeIcon
                  icon={mode === 'copy' ? faCopy : faFileArrowDown}
                  title={title}
                />
              </a>
            }
            onClick={handleOnClick}
            style={{
              width: enableSearch ? '100%' : '50%',
              height: '100%',
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
                  />
                </a>
              }
              style={{
                width: '50%',
                height: '100%',
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
      buttonStyle,
      component,
      componentStyle,
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
