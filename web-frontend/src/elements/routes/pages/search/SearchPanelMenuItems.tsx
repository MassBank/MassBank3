import { Form, FormItemProps, Input, InputNumber } from 'antd';
import {
  BarChartOutlined,
  BarcodeOutlined,
  DatabaseOutlined,
  QuestionCircleTwoTone,
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
import Tooltip from '../../../basic/Tooltip';
import { Content } from 'antd/es/layout/layout';
import defaultTooltipText from '../../../../constants/defaultTooltipText';

const peakListPattern: RegExp =
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
  const buildFormItemWithTootip = (
    label: string | undefined,
    name: FormItemProps<SearchFields>['name'],
    required: boolean,
    pattern: RegExp | undefined,
    labelColSpan: number,
    wrapperColSpan: number,
    children: React.ReactNode,
    tooltipText: string | undefined,
  ) => (
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
      <Content style={{ width: 'calc(100% - 25px)' }}>
        <Form.Item<SearchFields>
          label={label}
          name={name}
          rules={[pattern ? { required, pattern } : { required }]}
          style={{
            width: '100%',
            height: '100%',
          }}
          labelAlign="left"
          labelCol={{ span: labelColSpan }}
          wrapperCol={{ span: wrapperColSpan }}
        >
          {children}
        </Form.Item>
      </Content>
      <Tooltip title={tooltipText}>
        <QuestionCircleTwoTone
          style={{
            width: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      </Tooltip>
    </Content>
  );

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
      label: buildFormItemWithTootip(
        'Tolerance',
        ['spectralSearchFilterOptions', type, 'massTolerance'],
        false,
        undefined,
        7,
        17,
        <InputNumber
          placeholder="0.1"
          step={0.01}
          min={0}
          max={1}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            insertPlaceholder(e, {
              spectralSearchFilterOptions: {
                [type]: {
                  massTolerance: 0.1,
                },
              },
            })
          }
          style={{ width: '100%' }}
        />,
        `This parameter is used as mass tolerance value (+/-) during the search by ${type === 'peaks' ? 'peak masses' : 'peak differences (neutral losses)'}, e.g. 0.1.` +
          ' ' +
          defaultTooltipText,
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
      label: buildFormItemWithTootip(
        'Min. Intensity',
        ['spectralSearchFilterOptions', type, 'intensity'],
        false,
        undefined,
        7,
        17,
        <InputNumber
          placeholder="50"
          step={5}
          min={0}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            insertPlaceholder(e, {
              spectralSearchFilterOptions: {
                [type]: {
                  intensity: 50,
                },
              },
            })
          }
          style={{ width: '100%' }}
        />,
        `This parameter forms the lower peak intensity limit during the search by ${type === 'peaks' ? 'peak masses' : 'peak differences (neutral losses)'}, e.g. 50.` +
          ' ' +
          defaultTooltipText,
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
          label: buildFormItemWithTootip(
            'Name',
            ['compoundSearchFilterOptions', 'compoundName'],
            false,
            undefined,
            8,
            16,
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
            />,
            'Search by the name of the compound (e.g. Rutin). This value is used during a substring search.' +
              ' ' +
              defaultTooltipText,
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
          label: buildFormItemWithTootip(
            'Class',
            ['compoundSearchFilterOptions', 'compoundClass'],
            false,
            undefined,
            8,
            16,
            <Input
              type="text"
              placeholder="Flavonoid glycosides"
              allowClear
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                insertPlaceholder(e, {
                  compoundSearchFilterOptions: {
                    compoundClass: 'Flavonoid glycosides',
                  },
                })
              }
            />,
            'Search by the class of the compound. This can either be based on free text (e.g. Natural product) or an ChemOnt class name or ID (e.g. Flavonoid glycosides, CHEMONTID:0001111). This value is used during a substring search.' +
              ' ' +
              defaultTooltipText,
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
          label: buildFormItemWithTootip(
            'Formula',
            ['compoundSearchFilterOptions', 'formula'],
            false,
            undefined,
            8,
            16,
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
            />,
            'Search by a molecular formula of a compound, e.g. C27H30O16.' +
              ' ' +
              defaultTooltipText,
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
          label: buildFormItemWithTootip(
            'Exact Mass',
            ['compoundSearchFilterOptions', 'exactMass'],
            false,
            undefined,
            8,
            16,
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
              style={{ width: '100%' }}
            />,
            'Search by a molecular mass of a compound, e.g. 610.15338.' +
              ' ' +
              defaultTooltipText,
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
          label: buildFormItemWithTootip(
            'Mass Tolerance',
            ['compoundSearchFilterOptions', 'massTolerance'],
            false,
            undefined,
            8,
            16,
            <InputNumber
              placeholder="0.1"
              step={0.01}
              min={0}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                insertPlaceholder(e, {
                  compoundSearchFilterOptions: {
                    massTolerance: 0.1,
                  },
                })
              }
              style={{ width: '100%' }}
            />,
            'This parameter is used as tolerance value (+/-) during the search by a molecular mass, e.g. 0.1.' +
              ' ' +
              defaultTooltipText,
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
              label: buildFormItemWithTootip(
                undefined,
                ['compoundSearchFilterOptions', 'inchi'],
                false,
                undefined,
                0,
                24,
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
                />,
                'Search by InChI or InChIKey of a compound (e.g. IKGXIBQEEMLURG-NVPNHPEKSA-N).' +
                  ' ' +
                  defaultTooltipText,
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
                height: 750,
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
              label: buildFormItemWithTootip(
                'Peak List',
                ['spectralSearchFilterOptions', 'similarity', 'peakList'],
                false,
                peakListPattern,
                7,
                17,
                <Input.TextArea
                  placeholder="147.063 11&#10;303.05 999&#10;449.108 64&#10;465.102 587&#10;611.161 669"
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
                />,
                'Enter m/z and intensity values, delimited by a space, to be used during spectral similarity search.' +
                  ' ' +
                  defaultTooltipText,
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
              label: buildFormItemWithTootip(
                'Threshold',
                ['spectralSearchFilterOptions', 'similarity', 'threshold'],
                false,
                undefined,
                7,
                17,
                <InputNumber
                  placeholder="0.8"
                  step={0.05}
                  min={0}
                  max={1}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    insertPlaceholder(e, {
                      spectralSearchFilterOptions: {
                        similarity: {
                          threshold: 0.8,
                        },
                      },
                    })
                  }
                  style={{ width: '100%' }}
                />,
                'This parameter limits the number of results by setting this similarity score threshold value. It ranges from 0 to 1 (lowest to highest similarity).' +
                  ' ' +
                  defaultTooltipText,
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
              label: buildFormItemWithTootip(
                undefined,
                ['spectralSearchFilterOptions', 'splash'],
                false,
                undefined,
                0,
                24,
                <Input
                  type="text"
                  placeholder="splash10-0wmi-0009506000-98ca7f7c8f3072af4481"
                  allowClear
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    insertPlaceholder(e, {
                      spectralSearchFilterOptions: {
                        splash: 'splash10-0wmi-0009506000-98ca7f7c8f3072af4481',
                      },
                    })
                  }
                />,
                "Search by SPLASH code of a record's mass spectrum (e.g. splash10-0wmi-0009506000-98ca7f7c8f3072af4481)." +
                  ' ' +
                  defaultTooltipText,
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
