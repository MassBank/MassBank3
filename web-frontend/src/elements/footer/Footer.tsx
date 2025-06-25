import { Button, Col, Layout, Row } from 'antd';
import { usePropertiesContext } from '../../context/properties/properties';
import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const { Footer: FooterAntD } = Layout;

const backgroundColor: CSSProperties['backgroundColor'] = 'rgb(223, 223, 223)';

type InputProps = {
  height: CSSProperties['height'];
  enableDataPrivacyButton?: boolean;
  onClickDataPrivacy?: () => void;
};

function Footer({
  height,
  enableDataPrivacyButton = false,
  onClickDataPrivacy = () => {},
}: InputProps) {
  const { version } = usePropertiesContext();

  const [colSpan, setColSpan] = useState<number>(8);

  useEffect(() => {
    if (enableDataPrivacyButton) {
      setColSpan(6);
    } else {
      setColSpan(8);
    }
  }, [enableDataPrivacyButton]);

  const handleOnClickDataPrivacy = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      onClickDataPrivacy();
    },
    [onClickDataPrivacy],
  );

  return useMemo(
    () => (
      <FooterAntD
        style={{
          textAlign: 'center',
          width: '100%',
          height,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor,
          padding: 0,
        }}
      >
        <Row
          style={{
            width: '100%',
            height,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor,
          }}
        >
          <Col span={colSpan}>&copy; 2025 MassBank Team</Col>
          <Col span={colSpan}>Version: {version}</Col>
          <Col span={colSpan}>
            <a
              href="https://github.com/MassBank/MassBank3"
              target="_blank"
              title="Find us on GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                className="bi bi-github"
                viewBox="0 0 16 16"
                color="black"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
            </a>
          </Col>
          {enableDataPrivacyButton && (
            <Col span={colSpan}>
              <Button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
                onClick={handleOnClickDataPrivacy}
              >
                Data Privacy
              </Button>
            </Col>
          )}
        </Row>
      </FooterAntD>
    ),
    [
      colSpan,
      enableDataPrivacyButton,
      handleOnClickDataPrivacy,
      height,
      version,
    ],
  );
}

export default Footer;
