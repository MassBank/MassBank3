import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePropertiesContext } from '../../../../context/properties/properties';
import { Content } from 'antd/es/layout/layout';
import { Button, Result, Spin } from 'antd';
import StatusResult from '../../../../types/StatusResult';
import fetchServiceStatus from '../../../../utils/request/fetchServiceStatus';

const resultStyle = {
  width: 250,
  padding: 20,
};

function ServiceStatusView() {
  const { backendUrl } = usePropertiesContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusResult | null>(null);

  const handleOnCheckServiceStatus = useCallback(async () => {
    setIsLoading(true);

    const url = `${backendUrl}/status`;
    const _status = await fetchServiceStatus(url);

    setStatus(_status);
    setIsLoading(false);
  }, [backendUrl]);

  useEffect(() => {
    handleOnCheckServiceStatus();
  }, [handleOnCheckServiceStatus]);

  return useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          minHeight: 300,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isLoading ? (
          <Spin size="large" spinning={isLoading} />
        ) : (
          <Content
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'start',
            }}
          >
            <Result
              title="MassBank API"
              subTitle={
                <div>
                  <label style={{ color: 'black' }}>
                    {status?.api.error && status?.api.error.length > 0
                      ? status?.api.error
                      : 'Successfully connected'}
                  </label>
                  <br />
                  {!status?.api.error || status?.api.error?.length === 0 ? (
                    <label style={{ color: 'darkslategrey' }}>
                      ({status?.api.version?.trim() ?? 'Unknown'})
                    </label>
                  ) : null}
                </div>
              }
              status={
                status?.api.error && status?.api.error.length > 0
                  ? 'error'
                  : 'success'
              }
              style={resultStyle}
            />
            <Result
              title="Postgres Database"
              subTitle={
                <div>
                  <label style={{ color: 'black' }}>
                    {status?.postgres.error && status?.postgres.error.length > 0
                      ? status?.postgres.error
                      : 'Successfully connected'}
                  </label>
                  <br />
                  {!status?.postgres.error ||
                  status?.postgres.error?.length === 0 ? (
                    <label style={{ color: 'darkslategrey' }}>
                      ({status?.postgres.version?.trim() ?? 'Unknown'})
                    </label>
                  ) : null}
                  {
                    <>
                      <br />
                      {(!status?.postgres.error ||
                        status?.postgres.error?.length === 0) &&
                      status?.postgres.updateStatus !== 'done' ? (
                        <label style={{ color: 'blue' }}>
                          ({status?.postgres.updateStatus ?? 'Unknown'})
                        </label>
                      ) : null}
                    </>
                  }
                </div>
              }
              status={
                status?.postgres.error && status?.postgres.error.length > 0
                  ? 'error'
                  : status?.postgres.updateStatus !== 'done'
                    ? 'warning'
                    : 'success'
              }
              style={resultStyle}
            />
            <Result
              title="Similarity Service"
              subTitle={
                <div>
                  <label style={{ color: 'black' }}>
                    {status?.similarity_service.error &&
                    status?.similarity_service.error.length > 0
                      ? status?.similarity_service.error
                      : 'Successfully connected'}
                  </label>
                  <br />
                  {!status?.similarity_service.error ||
                  status?.similarity_service.error?.length === 0 ? (
                    <label style={{ color: 'darkslategrey' }}>
                      ({status?.similarity_service.version?.trim() ?? 'Unknown'}
                      )
                    </label>
                  ) : null}
                </div>
              }
              status={
                status?.similarity_service.error &&
                status?.similarity_service.error.length > 0
                  ? 'error'
                  : 'success'
              }
              style={resultStyle}
            />
            <Result
              title="Export Service"
              subTitle={
                <div>
                  <label style={{ color: 'black' }}>
                    {status?.export_service.error &&
                    status?.export_service.error.length > 0
                      ? status?.export_service.error
                      : 'Successfully connected'}
                  </label>
                  <br />
                  {!status?.export_service.error ||
                  status?.export_service.error?.length === 0 ? (
                    <label style={{ color: 'darkslategrey' }}>
                      ({status?.export_service.version?.trim() ?? 'Unknown'})
                    </label>
                  ) : null}
                </div>
              }
              status={
                status?.export_service.error &&
                status?.export_service.error.length > 0
                  ? 'error'
                  : 'success'
              }
              style={resultStyle}
            />
          </Content>
        )}
        <Button
          type="primary"
          onClick={handleOnCheckServiceStatus}
          disabled={isLoading}
          style={{
            marginTop: 20,
            backgroundColor: 'lightgrey',
            color: 'black',
          }}
        >
          Refresh
        </Button>
      </Content>
    ),
    [handleOnCheckServiceStatus, isLoading, status],
  );
}

export default ServiceStatusView;
