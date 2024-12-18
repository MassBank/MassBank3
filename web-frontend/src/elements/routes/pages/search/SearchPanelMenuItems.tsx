import {
  faBarcode,
  faChartColumn,
  faFlask,
  faShareNodes,
  faSignature,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Input, InputNumber } from 'antd';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import PeakSearch from './searchPanel/peakSearch/PeakSearch';
import MassSpecFilterOptionsMenuItems from './searchPanel/msSpecFilter/MassSpecFilterOptionsMenuItems';
import StructuralEditor from '../../../basic/StructuralEditor';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';

const peakListPattern =
  /^(\d+(\.\d+)* \d+(\.\d+)*)(\n\d+(\.\d+)* \d+(\.\d+)*)*$/;

type InputProps = {
  massSpecFilterOptions: ContentFilterOptions | undefined;
  width: number;
};

function SearchPanelMenuItems({ massSpecFilterOptions, width }: InputProps) {
  return [
    {
      key: 'basicSearchMenuItem',
      label: 'Basic Search',
      icon: <FontAwesomeIcon icon={faSliders} />,
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
              label="Compound Name"
              name={['basicSearchFilterOptions', 'compoundName']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input type="text" placeholder="Rutin" allowClear />
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
              label="Molecular Formula"
              name={['basicSearchFilterOptions', 'formula']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input type="text" placeholder="C27H30O16" allowClear />
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
              name={['basicSearchFilterOptions', 'exactMass']}
              rules={[{ required: false }]}
              style={{
                width: '100%',
                height: '100%',
              }}
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <InputNumber placeholder="610.15338" step={0.01} min={0} />
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
              name={['basicSearchFilterOptions', 'massTolerance']}
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
      ],
    },
    {
      key: 'peaksMenuItem',
      label: 'Peaks',
      icon: <FontAwesomeIcon icon={faChartColumn} />,
      children: [
        {
          key: 'similarityMenuItem',
          label: 'Similarity',
          children: [
            {
              key: 'peakList',
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
                  name={['peaks', 'similarity', 'peakList']}
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
                    placeholder="m/z and intensity, delimited by a space. &#10;&#10;147.063 11&#10;303.05 999&#10;449.108 64&#10;465.102 588&#10;611.161 670"
                    autoSize={{ minRows: 5 }}
                    allowClear
                  />
                </Form.Item>
              ),
            },
            {
              key: 'threshold',
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
                  label="Threshold"
                  name={['peaks', 'similarity', 'threshold']}
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
          key: 'peakSearchMenuItem',
          label: 'Peak Search',
          children: [
            {
              key: 'peaks_panel',
              style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 0,
              },
              label: <PeakSearch />,
            },
            {
              key: 'massTolerance_peaks',
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
                  name={['peaks', 'peaks', 'massTolerance']}
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
              key: 'intensity',
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
                  name={['peaks', 'peaks', 'intensity']}
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
          ],
        },
        {
          key: 'peakDifferenceMenuItem',
          label: 'Peak Difference',
          children: [
            {
              key: 'peakDifference',
              style: {
                width: '100%',
                height: '100%',
                marginLeft: 0,
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center',
                textAlign: 'center',
                color: 'orange',
              },
              label: 'Feature is not yet implemented!',
            },
          ],
        },
      ],
    },
    {
      key: 'inchiMenuItem',
      label: 'InChI',
      icon: <FontAwesomeIcon icon={faSignature} />,
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
              name="inchi"
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
              />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: 'splashMenuItem',
      label: 'SPLASH',
      icon: <FontAwesomeIcon icon={faBarcode} />,
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
              name="splash"
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
              />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: 'massSpecMenuItem',
      label: 'Mass Spectrometry',
      icon: <FontAwesomeIcon icon={faFlask} />,
      children: MassSpecFilterOptionsMenuItems({ massSpecFilterOptions }),
    },
    {
      key: 'structureMenuItem',
      label: 'Structure',
      icon: <FontAwesomeIcon icon={faShareNodes} />,
      children: [
        {
          key: 'structure',
          style: {
            width: '100%',
            height: 700,
            marginLeft: 0,
            overflow: 'scroll',
          },
          label: <StructuralEditor width={width - 100} />,
        },
      ],
    },
  ];
}

export default SearchPanelMenuItems;
