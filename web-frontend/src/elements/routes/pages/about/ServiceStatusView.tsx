import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePropertiesContext } from '../../../../context/properties/properties';
import { Content } from 'antd/es/layout/layout';
import { Button, Result, Spin } from 'antd';
import axios from 'axios';
import StatusResult from '../../../../types/StatusResult';

const resultStyle = {
  width: 250,
  padding: 20,
};

function ServiceStatusView() {
  const { backendUrl } = usePropertiesContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [errorPostgres, setErrorPostgres] = useState<string | null>(null);
  const [errorSimilarityService, setErrorSimilarityService] = useState<
    string | null
  >(null);
  const [errorExportService, setErrorExportService] = useState<string | null>(
    null,
  );

  const handleOnCheckServiceStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${backendUrl}/status`);
      if (response.status === 200) {
        setErrorApi(null);
        const statusResult = response.data as StatusResult;
        setErrorPostgres(
          statusResult.postgres.error ? statusResult.postgres.error : null,
        );
        setErrorSimilarityService(
          statusResult.similarity_service.error
            ? statusResult.similarity_service.error
            : null,
        );
        setErrorExportService(
          statusResult.export_service.error
            ? statusResult.export_service.error
            : null,
        );
      } else {
        setErrorApi(response.statusText);
        setErrorPostgres("Couldn't connect to the API");
        setErrorSimilarityService("Couldn't connect to the API");
        setErrorExportService("Couldn't connect to the API");
      }
    } catch (error: unknown) {
      setErrorApi((error as Error).message);
      setErrorPostgres("Couldn't connect to the API");
      setErrorSimilarityService("Couldn't connect to the API");
      setErrorExportService("Couldn't connect to the API");
      console.error(error);
    }

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
                <p style={{ color: 'black' }}>
                  {errorApi && errorApi.length > 0
                    ? errorApi
                    : 'Successfully connected'}
                </p>
              }
              status={errorApi && errorApi.length > 0 ? 'error' : 'success'}
              style={resultStyle}
            />
            <Result
              title="Postgres Database"
              subTitle={
                <p style={{ color: 'black' }}>
                  {errorPostgres && errorPostgres.length > 0
                    ? errorPostgres
                    : 'Successfully connected'}
                </p>
              }
              status={
                errorPostgres && errorPostgres.length > 0 ? 'error' : 'success'
              }
              style={resultStyle}
            />
            <Result
              title="Similarity Service"
              subTitle={
                <p style={{ color: 'black' }}>
                  {errorSimilarityService && errorSimilarityService.length > 0
                    ? errorSimilarityService
                    : 'Successfully connected'}
                </p>
              }
              status={
                errorSimilarityService && errorSimilarityService.length > 0
                  ? 'error'
                  : 'success'
              }
              style={resultStyle}
            />
            <Result
              title="Export Service"
              subTitle={
                <p style={{ color: 'black' }}>
                  {errorExportService && errorExportService.length > 0
                    ? errorExportService
                    : 'Successfully connected'}
                </p>
              }
              status={
                errorExportService && errorExportService.length > 0
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
    [
      errorApi,
      errorExportService,
      errorPostgres,
      errorSimilarityService,
      handleOnCheckServiceStatus,
      isLoading,
    ],
  );
}

export default ServiceStatusView;
