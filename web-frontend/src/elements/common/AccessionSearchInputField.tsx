import { Button, Input } from 'antd';
import { Content } from 'antd/es/layout/layout';
import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useState,
} from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import { usePropertiesContext } from '../../context/properties/properties';

type InputProps = {
  accession?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  buttonStyle?: CSSProperties;
};

function AccessionSearchInputField({
  accession: acc,
  style = {},
  inputStyle = {},
  buttonStyle = {},
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

  return (
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
      <p style={{ marginRight: 20, fontWeight: 'bold' }}>Go to accession:</p>
      <Input
        type="text"
        placeholder="e.g. MSBNK-AAFC-AC000114"
        value={accession && accession !== '' ? accession : undefined}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        allowClear
        style={{ width: 400, ...inputStyle }}
      />
      <Button
        children="Search"
        onClick={handleOnClick}
        disabled={accession.trim() === ''}
        style={{ width: 100, marginLeft: 20, ...buttonStyle }}
      />
    </Content>
  );
}

export default AccessionSearchInputField;
