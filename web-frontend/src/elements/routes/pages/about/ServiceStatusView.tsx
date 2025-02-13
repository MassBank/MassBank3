import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePropertiesContext } from '../../../../context/properties/properties';
import { Content } from 'antd/es/layout/layout';
import { Button, Result, Spin } from 'antd';
import axios from 'axios';

function ServiceStatusView() {
  const { backendUrl, baseUrl, exportServiceUrl, similarityServiceUrl } =
    usePropertiesContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [errorSimilarityService, setErrorSimilarityService] = useState<
    string | null
  >(null);
  const [errorExportService, setErrorExportService] = useState<string | null>(
    null,
  );

  const handleOnCheckServiceStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${baseUrl + backendUrl}/v1/version`);
      if (response.status === 200) {
        setErrorApi(null);
      } else {
        setErrorApi(response.statusText);
      }
    } catch (error: unknown) {
      setErrorApi((error as Error).message);
      console.error(error);
    }
    try {
      const response = await axios.get(
        `${baseUrl + similarityServiceUrl}/version`,
      );
      if (response.status === 200) {
        setErrorSimilarityService(null);
      } else {
        setErrorSimilarityService(response.statusText);
      }
    } catch (error: unknown) {
      setErrorSimilarityService((error as Error).message);
      console.error(error);
    }
    try {
      const response = await axios.get(`${baseUrl + exportServiceUrl}/version`);
      if (response.status === 200) {
        setErrorExportService(null);
      } else {
        setErrorExportService(response.statusText);
      }
    } catch (error: unknown) {
      setErrorExportService((error as Error).message);
      console.error(error);
    }

    setIsLoading(false);
  }, [backendUrl, baseUrl, exportServiceUrl, similarityServiceUrl]);

  useEffect(() => {
    handleOnCheckServiceStatus();
  }, [handleOnCheckServiceStatus]);

  return useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          height: 250,
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
                errorApi && errorApi.length > 0
                  ? errorApi
                  : 'Successfully connected'
              }
              status={errorApi && errorApi.length > 0 ? 'error' : 'success'}
              style={{ padding: 20 }}
            />
            <Result
              title="Similarity Service"
              subTitle={
                errorSimilarityService && errorSimilarityService.length > 0
                  ? errorSimilarityService
                  : 'Successfully connected'
              }
              status={
                errorSimilarityService && errorSimilarityService.length > 0
                  ? 'error'
                  : 'success'
              }
              style={{ padding: 20 }}
            />
            <Result
              title="Export Service"
              subTitle={
                errorExportService && errorExportService.length > 0
                  ? errorExportService
                  : 'Successfully connected'
              }
              status={
                errorExportService && errorExportService.length > 0
                  ? 'error'
                  : 'success'
              }
              style={{ padding: 20 }}
            />
          </Content>
        )}
        <Button
          type="primary"
          onClick={handleOnCheckServiceStatus}
          disabled={isLoading}
          style={{ marginTop: 20 }}
        >
          Reload
        </Button>
      </Content>
    ),
    [
      errorApi,
      errorExportService,
      errorSimilarityService,
      handleOnCheckServiceStatus,
      isLoading,
    ],
  );
}

export default ServiceStatusView;
