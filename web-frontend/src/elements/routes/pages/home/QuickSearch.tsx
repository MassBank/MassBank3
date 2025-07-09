import { Content } from 'antd/es/layout/layout';
import { KeyboardEvent, useCallback, useMemo } from 'react';
import AccessionSearchInputField from '../../../common/AccessionSearchInputField';
import accessionSearchInputFieldHeight from '../../../../constants/accessionSearchInputFieldHeight';
import SearchPanelForm from '../../../common/SearchPanelForm';
import SearchPanelMenuItems from '../search/SearchPanelMenuItems';
import { useForm } from 'antd/es/form/Form';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import { usePropertiesContext } from '../../../../context/properties/properties';
import { createSearchParams, useNavigate } from 'react-router-dom';
import buildSearchParamsFromFormData from '../../../../utils/buildSearchParamsFromFormData';
import routes from '../../../../constants/routes';
import defaultSearchFieldValues from '../../../../constants/defaultSearchFieldValues';
import Text from 'antd/es/typography/Text';

function QuickSearch() {
  const [form] = useForm<SearchFields>();
  const { baseUrl } = usePropertiesContext();
  const navigate = useNavigate();

  const handleOnInsertPlaceholder = useCallback(
    (e: KeyboardEvent<HTMLElement>, values: SearchFields) => {
      if (e.ctrlKey && e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();

        form.setFieldsValue(values);
      }
    },
    [form],
  );

  const handleOnSubmit = useCallback(
    async (formData: SearchFields) => {
      const builtSearchParams = buildSearchParamsFromFormData(formData);
      navigate({
        pathname: baseUrl + '/' + routes.search.path,
        search: `?${Object.keys(builtSearchParams).length > 0 ? createSearchParams(builtSearchParams) : createSearchParams({ plain: 'true' })}`,
      });
    },
    [baseUrl, navigate],
  );

  return useMemo(() => {
    return (
      <Content
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
        }}
      >
        <Content
          style={{
            width: '700px',
            height: accessionSearchInputFieldHeight,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          <AccessionSearchInputField />
        </Content>
        <Text
          strong
          style={{ width: '100%', marginBottom: 10, textAlign: 'center' }}
        >
          Compound/Spectral Search:
        </Text>
        <SearchPanelForm
          form={form}
          items={SearchPanelMenuItems({
            insertPlaceholder: handleOnInsertPlaceholder,
          })}
          initialValues={defaultSearchFieldValues}
          onSubmit={handleOnSubmit}
          collapsed={false}
          collapseButtonWidth={0}
          style={{
            width: '80%',
            border: '1px solid lightgrey',
            borderRadius: 5,
            backgroundColor: 'rgb(250, 250, 250)',
          }}
        />
      </Content>
    );
  }, [form, handleOnInsertPlaceholder, handleOnSubmit]);
}

export default QuickSearch;
