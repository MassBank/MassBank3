import { Button, Input } from 'antd';
import { Content } from 'antd/es/layout/layout';
import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import { usePropertiesContext } from '../../context/properties/properties';

type InputProps = {
  accession?: string;
  labelText?: string;
  placeholderText?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  buttonStyle?: CSSProperties;
  disableButton?: boolean;
  disableLabel?: boolean;
};

function AccessionSearchInputField({
  accession: acc,
  labelText = 'Go to accession',
  placeholderText = 'e.g. MSBNK-AAFC-AC000114',
  style = {},
  inputStyle = {},
  buttonStyle = {},
  disableButton = false,
  disableLabel = false,
}: InputProps) {
  const [accession, setAccession] = useState<string>(acc ?? '');
  const navigate = useNavigate();
  const { baseUrl } = usePropertiesContext();

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setAccession(e.target.value.trim());
  }, []);

  const handleOnClick = useCallback(
    () =>
      navigate({
        pathname: baseUrl + '/' + routes.accession.path,
        search: `?${createSearchParams({ id: accession })}`,
      }),
    [accession, baseUrl, navigate],
  );

  const handleOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleOnClick();
      }
    },
    [handleOnClick],
  );

  return useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          ...style,
        }}
      >
        {!disableLabel && (
          <p style={{ marginRight: 20, fontWeight: 'bold' }}>{labelText}</p>
        )}
        <Input
          type="text"
          placeholder={placeholderText}
          value={accession && accession !== '' ? accession : undefined}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          allowClear
          style={{ width: 400, ...inputStyle }}
        />
        {!disableButton && (
          <Button
            children="Search"
            onClick={handleOnClick}
            disabled={accession.trim() === ''}
            style={{
              width: 100,
              marginLeft: 20,
              backgroundColor: 'rgb(167, 199, 254)',
              ...buttonStyle,
            }}
          />
        )}
      </Content>
    ),
    [
      accession,
      buttonStyle,
      disableButton,
      disableLabel,
      handleOnChange,
      handleOnClick,
      handleOnKeyDown,
      inputStyle,
      labelText,
      placeholderText,
      style,
    ],
  );
}

export default AccessionSearchInputField;
