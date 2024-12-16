import { Form } from 'antd';
import FilterTable from './FilterTable';
import SearchFields from '../../../../../../types/filterOptions/SearchFields';
import ContentFilterOptions from '../../../../../../types/filterOptions/ContentFilterOtions';

type InputProps = {
  massSpecFilterOptions: ContentFilterOptions | undefined;
};

function MassSpecFilterOptionsMenuItems({ massSpecFilterOptions }: InputProps) {
  return [
    {
      key: 'massSpecFilterOptionsContributor',
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
              filterOptions={massSpecFilterOptions?.contributor || []}
              filterName="massSpecFilterOptions"
              label="contributor"
            />
          ),
        },
      ],
    },
    {
      key: 'massSpecFilterOptionsInstrumentType',
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
              name={['massSpecFilterOptions', 'instrument_type']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <FilterTable
                filterOptions={massSpecFilterOptions?.instrument_type || []}
                filterName="massSpecFilterOptions"
                label="instrument_type"
              />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: 'massSpecFilterOptionsMsType',
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
              name={['massSpecFilterOptions', 'ms_type']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <FilterTable
                filterOptions={massSpecFilterOptions?.ms_type || []}
                filterName="massSpecFilterOptions"
                label="ms_type"
                height={50}
              />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: 'massSpecFilterOptionsIonMode',
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
              name={['massSpecFilterOptions', 'ion_mode']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <FilterTable
                filterOptions={massSpecFilterOptions?.ion_mode || []}
                filterName="massSpecFilterOptions"
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

export default MassSpecFilterOptionsMenuItems;
