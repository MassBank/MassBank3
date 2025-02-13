import { Button, Result } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertiesContext } from '../../../../context/properties/properties';

function NotFoundView() {
  const navigate = useNavigate();
  const { baseUrl } = usePropertiesContext();

  const handleOnNavigateHome = useCallback(() => {
    navigate(baseUrl);
  }, [baseUrl, navigate]);

  return useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button type="primary" onClick={handleOnNavigateHome}>
              Back Home
            </Button>
          }
        />
      </Content>
    ),
    [handleOnNavigateHome],
  );
}

export default NotFoundView;
