import { Form } from 'antd';
import FilterTable from '../../../../../common/FilterTable';
import SearchFields from '../../../../../../types/filterOptions/SearchFields';
import ContentFilterOptions from '../../../../../../types/filterOptions/ContentFilterOtions';

type InputProps = {
  propertyFilterOptions: ContentFilterOptions | undefined;
  showCounts?: boolean;
};

function PropertyFilterOptionsMenuItems({
  propertyFilterOptions,
  showCounts = false,
}: InputProps) {
  return [
    {
      key: 'propertyFilterOptions.contributor',
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
              filterOptions={propertyFilterOptions?.contributor ?? []}
              filterName="propertyFilterOptions"
              label="contributor"
              showCounts={showCounts}
            />
          ),
        },
      ],
    },
    {
      key: 'propertyFilterOptions.instrument_type',
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
                filterOptions={propertyFilterOptions?.instrument_type ?? []}
                filterName="propertyFilterOptions"
                label="instrument_type"
                showCounts={showCounts}
              />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: 'propertyFilterOptions.ms_type',
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
                filterOptions={propertyFilterOptions?.ms_type ?? []}
                filterName="propertyFilterOptions"
                label="ms_type"
                height={80}
                showCounts={showCounts}
              />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: 'propertyFilterOptions.ion_mode',
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
                filterOptions={propertyFilterOptions?.ion_mode ?? []}
                filterName="propertyFilterOptions"
                label="ion_mode"
                height={30}
                showCounts={showCounts}
              />
            </Form.Item>
          ),
        },
      ],
    },
  ];
}

export default PropertyFilterOptionsMenuItems;
