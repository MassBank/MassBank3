import { Form, Input, InputNumber } from 'antd';
import {
  BarChartOutlined,
  BarcodeOutlined,
  DatabaseOutlined,
  ShareAltOutlined,
  SignatureOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import PeakSearch from './searchPanel/peakSearch/PeakSearch';
import PropertyFilterOptionsMenuItems from './searchPanel/msSpecFilter/PropertyFilterOptionsMenuItems';
import StructuralEditor from '../../../basic/StructuralEditor';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import defaultSearchFieldValues from '../../../../constants/defaultSearchFieldValues';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { KeyboardEvent } from 'react';

const peakListPattern =
  /^(\d+(\.\d+){0,1} \d+(\.\d+){0,1}( \d+(\.\d+){0,1}){0,1})(\n\d+(\.\d+){0,1} \d+(\.\d+){0,1}( \d+(\.\d+){0,1}){0,1})*$/;

type InputProps = {
  propertyFilterOptions?: ContentFilterOptions | undefined;
  initialStructure?: string;
  insertPlaceholder?: (
    e: KeyboardEvent<HTMLElement>,
    values: SearchFields,
  ) => void;
};

function SearchPanelMenuItems({
  propertyFilterOptions = defaultSearchFieldValues.propertyFilterOptions,
  initialStructure = '',
  insertPlaceholder = () => {},
}: InputProps) {
  const buildPeakBasedSearchFields = (type: 'peaks' | 'neutralLoss') => [
    {
      key: type + '_panel',
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0,
      },
      label: <PeakSearch type={type} />,
    },
    {
      key: type + '_massTolerance_peaks',
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0,
      },
      label: (
        <Form.Item<SearchFields>
          label="Mass Tolerance"
          name={['spectralSearchFilterOptions', type, 'massTolerance']}
          rules={[{ required: false }]}
          style={{
            width: '100%',
            height: '100%',
          }}
          labelAlign="left"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
        >
          <InputNumber placeholder="0.1" step={0.01} min={0} max={1} />
        </Form.Item>
      ),
    },
    {
      key: type + '_intensity',
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0,
      },
      label: (
        <Form.Item<SearchFields>
          label="Min. Intensity"
          name={['spectralSearchFilterOptions', type, 'intensity']}
          rules={[{ required: false }]}
          style={{
            width: '100%',
            height: '100%',
          }}
          labelAlign="left"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
        >
          <InputNumber placeholder="50" step={5} min={0} />
        </Form.Item>
      ),
    },
  ];

  const items: ItemType<MenuItemType>[] = [
    {
      key: 'compoundSearchFilterOptions',
      label: 'Compound Search',
      icon: <SlidersOutlined />,
      children: [
        {
          key: 'compoundName',
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 0,
          },
          label: (
            <Form.Item<SearchFields>
              label="Name"
              name={['compoundSearchFilterOptions', 'compoundName']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input
                type="text"
                placeholder="Rutin"
                allowClear
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  insertPlaceholder(e, {
                    compoundSearchFilterOptions: {
                      compoundName: 'Rutin',
                    },
                  })
                }
              />
            </Form.Item>
          ),
        },
        {
          key: 'compoundClass',
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 0,
          },
          label: (
            <Form.Item<SearchFields>
              label="Class"
              name={['compoundSearchFilterOptions', 'compoundClass']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input
                type="text"
                placeholder="Natural Product"
                allowClear
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  insertPlaceholder(e, {
                    compoundSearchFilterOptions: {
                      compoundClass: 'Natural Product',
                    },
                  })
                }
              />
            </Form.Item>
          ),
        },
        {
          key: 'formula',
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 0,
          },
          label: (
            <Form.Item<SearchFields>
              label="Formula"
              name={['compoundSearchFilterOptions', 'formula']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input
                type="text"
                placeholder="C27H30O16"
                allowClear
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  insertPlaceholder(e, {
                    compoundSearchFilterOptions: {
                      formula: 'C27H30O16',
                    },
                  })
                }
              />
            </Form.Item>
          ),
        },
        {
          key: 'exactMass',
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 0,
          },
          label: (
            <Form.Item<SearchFields>
              label="Exact Mass"
              name={['compoundSearchFilterOptions', 'exactMass']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <InputNumber
                placeholder="610.15338"
                step={0.01}
                min={0}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  insertPlaceholder(e, {
                    compoundSearchFilterOptions: {
                      exactMass: 610.15338,
                    },
                  })
                }
              />
            </Form.Item>
          ),
        },
        {
          key: 'massTolerance_basic',
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 0,
          },
          label: (
            <Form.Item<SearchFields>
              label="Mass Tolerance"
              name={['compoundSearchFilterOptions', 'massTolerance']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <InputNumber placeholder="0.1" step={0.01} min={0} />
            </Form.Item>
          ),
        },
        {
          key: 'compoundSearchFilterOptions.inchi.menuItem',
          label: 'InChI(Key)',
          icon: <SignatureOutlined />,
          children: [
            {
              key: 'inchi',
              style: {
                width: '100%',
                height: '100%',
                marginLeft: 0,
              },
              label: (
                <Form.Item<SearchFields>
                  name={['compoundSearchFilterOptions', 'inchi']}
                  rules={[{ required: false }]}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Input
                    type="text"
                    placeholder="IKGXIBQEEMLURG-NVPNHPEKSA-N"
                    allowClear
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                      insertPlaceholder(e, {
                        compoundSearchFilterOptions: {
                          inchi: 'IKGXIBQEEMLURG-NVPNHPEKSA-N',
                        },
                      })
                    }
                  />
                </Form.Item>
              ),
            },
          ],
        },
        {
          key: 'compoundSearchFilterOptions.structure.menuItem',
          label: 'Structure',
          icon: <ShareAltOutlined />,
          children: [
            {
              key: 'structure',
              style: {
                width: '100%',
                height: 700,
                marginLeft: 0,
                overflow: 'scroll',
              },
              label: (
                <StructuralEditor
                  initialSMILES={initialStructure}
                  insertPlaceholder={insertPlaceholder}
                />
              ),
            },
          ],
        },
      ],
    },
    {
      key: 'spectralSearchFilterOptions',
      label: 'Spectral Search',
      icon: <BarChartOutlined />,
      children: [
        {
          key: 'spectralSearchFilterOptions.similarity.menuItem',
          label: 'Similarity Search',
          children: [
            {
              key: 'similarityPeakList',
              style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 0,
              },
              label: (
                <Form.Item<SearchFields>
                  label="Peak List"
                  name={[
                    'spectralSearchFilterOptions',
                    'similarity',
                    'peakList',
                  ]}
                  rules={[{ required: false, pattern: peakListPattern }]}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  labelAlign="left"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                >
                  <Input.TextArea
                    placeholder="m/z and intensity, delimited by a space. &#10;&#10;147.063 11&#10;303.05 999&#10;449.108 64&#10;465.102 587&#10;611.161 669"
                    autoSize={{ minRows: 5 }}
                    allowClear
                    onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) =>
                      insertPlaceholder(e, {
                        spectralSearchFilterOptions: {
                          similarity: {
                            peakList:
                              '147.063 11\n303.05 999\n449.108 64\n465.102 587\n611.161 669',
                          },
                        },
                      })
                    }
                  />
                </Form.Item>
              ),
            },
            {
              key: 'similarityThreshold',
              style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 0,
              },
              label: (
                <Form.Item<SearchFields>
                  label="Score Threshold"
                  name={[
                    'spectralSearchFilterOptions',
                    'similarity',
                    'threshold',
                  ]}
                  rules={[{ required: false }]}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  labelAlign="left"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                >
                  <InputNumber placeholder="0.8" step={0.05} min={0} max={1} />
                </Form.Item>
              ),
            },
          ],
        },
        {
          key: 'spectralSearchFilterOptions.peaks.menuItem',
          label: 'Peak Search',
          children: buildPeakBasedSearchFields('peaks'),
        },
        {
          key: 'spectralSearchFilterOptions.neutralLoss.menuItem',
          label: 'Neutral Loss Search',
          children: buildPeakBasedSearchFields('neutralLoss'),
        },
        {
          key: 'spectralSearchFilterOptions.splash.menuItem',
          label: 'SPLASH',
          icon: <BarcodeOutlined />,
          children: [
            {
              key: 'splash',
              style: {
                width: '100%',
                height: '100%',
                marginLeft: 0,
              },
              label: (
                <Form.Item<SearchFields>
                  name={['spectralSearchFilterOptions', 'splash']}
                  rules={[{ required: false }]}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Input
                    type="text"
                    placeholder="splash10-0wmi-0009506000-98ca7f7c8f3072af4481"
                    allowClear
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                      insertPlaceholder(e, {
                        spectralSearchFilterOptions: {
                          splash:
                            'splash10-0wmi-0009506000-98ca7f7c8f3072af4481',
                        },
                      })
                    }
                  />
                </Form.Item>
              ),
            },
          ],
        },
      ],
    },
  ];

  if (propertyFilterOptions) {
    items.push({
      key: 'propertyFilterOptions',
      label: 'Property Filter',
      icon: <DatabaseOutlined />,
      children: PropertyFilterOptionsMenuItems({ propertyFilterOptions }),
    });
  }

  return items;
}

export default SearchPanelMenuItems;
