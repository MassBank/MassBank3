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
import Tooltip from '../basic/Tooltip';
import { QuestionCircleTwoTone } from '@ant-design/icons';

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
  labelText = 'Go to accession:',
  placeholderText = 'MSBNK-IPB_Halle-PB001341',
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

  const handleOnClick = useCallback(() => {
    if (accession.trim() !== '') {
      navigate({
        pathname: baseUrl + '/' + routes.accession.path,
        search: `?${createSearchParams({ id: accession })}`,
      });
    }
  }, [accession, baseUrl, navigate]);

  const handleOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        // If Enter is pressed, trigger the search
        handleOnClick();
      } else if (e.ctrlKey && e.key === ' ') {
        // If Ctrl + Space is pressed, set the input to a pre-defined example accession
        setAccession('MSBNK-IPB_Halle-PB001341');
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
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Content
          style={{
            width: 'calc(100% - 25px)',
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
                marginLeft: 10,
                backgroundColor: 'rgb(167, 199, 254)',
                ...buttonStyle,
              }}
            />
          )}
        </Content>
        <Tooltip
          title={
            'Search for an accession id in the database, e.g. MSBNK-IPB_Halle-PB001341. Press the button or Enter to search. Use Ctrl + Space to insert the example value into the input field.'
          }
        >
          <QuestionCircleTwoTone
            style={{
              width: '25px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5,
            }}
          />
        </Tooltip>
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
