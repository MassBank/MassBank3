import { Form } from 'antd';
import FilterTable from '../../../../../common/FilterTable';
import SearchFields from '../../../../../../types/filterOptions/SearchFields';
import ContentFilterOptions from '../../../../../../types/filterOptions/ContentFilterOtions';

type InputProps = {
  propertyFilterOptions: ContentFilterOptions | undefined;
};

function PropertyFilterOptionsMenuItems({ propertyFilterOptions }: InputProps) {
  return [
    {
      key: 'propertyFilterOptionsContributor',
      label: 'Contributor',
      children: [
        {
          key: 'contributor',
          style: {
            width: '100%',
            height: '100%',
            marginLeft: 0,
            overflow: 'scroll',
          },
          label: (
            <FilterTable
              filterOptions={propertyFilterOptions?.contributor || []}
              filterName="propertyFilterOptions"
              label="contributor"
            />
          ),
        },
      ],
    },
    {
      key: 'propertyFilterOptionsInstrumentType',
      label: 'Instrument Type',
      children: [
        {
          key: 'intrumentType',
          style: {
            width: '100%',
            height: '100%',
            marginLeft: 0,
            overflow: 'scroll',
          },
          label: (
            <Form.Item<SearchFields>
              name={['propertyFilterOptions', 'instrument_type']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <FilterTable
                filterOptions={propertyFilterOptions?.instrument_type || []}
                filterName="propertyFilterOptions"
                label="instrument_type"
              />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: 'propertyFilterOptionsMsType',
      label: 'MS Type',
      children: [
        {
          key: 'msType',
          style: {
            width: '100%',
            height: '100%',
            marginLeft: 0,
            overflow: 'scroll',
          },
          label: (
            <Form.Item<SearchFields>
              name={['propertyFilterOptions', 'ms_type']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <FilterTable
                filterOptions={propertyFilterOptions?.ms_type || []}
                filterName="propertyFilterOptions"
                label="ms_type"
                height={50}
              />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: 'propertyFilterOptionsIonMode',
      label: 'Ion Mode',
      children: [
        {
          key: 'ionMode',
          style: {
            width: '100%',
            height: '100%',
            marginLeft: 0,
            overflow: 'scroll',
          },
          label: (
            <Form.Item<SearchFields>
              name={['propertyFilterOptions', 'ion_mode']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <FilterTable
                filterOptions={propertyFilterOptions?.ion_mode || []}
                filterName="propertyFilterOptions"
                label="ion_mode"
                height={30}
              />
            </Form.Item>
          ),
        },
      ],
    },
  ];
}

export default PropertyFilterOptionsMenuItems;
