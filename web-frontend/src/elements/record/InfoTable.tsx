import './InfoTable.scss';

import Record from '../../types/record';
import StructureView from '../basic/StructureView';
import { MF } from 'react-mf';
import { useMemo } from 'react';
import Chart from '../basic/Chart';
import PeakData from '../../types/PeakData';

type InputProps = {
  record: Record;
  className?: string;
};

const peakData: PeakData[] = [
  { mz: 55.0186, intensity: 14357.4365234375, relIntensity: 190 },
  { mz: 55.0549, intensity: 11364.4716796875, relIntensity: 150 },
  { mz: 57.0342, intensity: 5241.548828125, relIntensity: 68 },
  { mz: 65.0386, intensity: 3729.0556640625, relIntensity: 48 },
  { mz: 67.0542, intensity: 28890.994140625, relIntensity: 383 },
  { mz: 69.0335, intensity: 41049.04296875, relIntensity: 545 },
  { mz: 69.0706, intensity: 2940.10791015625, relIntensity: 38 },
  { mz: 71.0491, intensity: 4798.919921875, relIntensity: 62 },
  { mz: 75.8226, intensity: 2418.90478515625, relIntensity: 31 },
  { mz: 77.0386, intensity: 2472.09716796875, relIntensity: 31 },
  { mz: 79.0542, intensity: 60779.8125, relIntensity: 807 },
  { mz: 81.0335, intensity: 3236.693359375, relIntensity: 42 },
  { mz: 81.0699, intensity: 32742.322265625, relIntensity: 434 },
  // 83.0491 16135.0458984375 213
  // 84.9601 63173.57421875 839
  // 85.0284 14789.654296875 195
  // 91.0542 48909.30078125 649
  // 93.0699 29105.458984375 386
  // 95.0491 41924.47265625 556
  // 95.0855 2836.140380859375 36
  // 97.0284 3173.412841796875 41
  // 97.0648 40049.11328125 531
  { mz: 102.9704, intensity: 18519.376953125, relIntensity: 245 },
  // 103.039 11823.3271484375 156
  // 103.0542 2963.396728515625 38
  // 105.045 3509.188232421875 45
  { mz: 105.0699, intensity: 50392.07421875, relIntensity: 669 },
  // 107.0491 25667.052734375 340
  // 107.0855 14300.6748046875 189
  // 109.0284 3268.812255859375 42
  { mz: 109.0648, intensity: 38076.9140625, relIntensity: 505 },
  // 109.1012 2508.84912109375 32
  // 111.0441 5642.57763671875 74
  // 113.0597 3255.41748046875 42
  // 115.0542 10478.271484375 138
  // 117.0699 20853.265625 276
  // 119.0491 4033.01171875 52
  // 119.0855 23595.61328125 312
  { mz: 120.9812, intensity: 3181.804931640625, relIntensity: 41 },
  // 121.0648 52525.3671875 697
  // 121.1012 4434.9501953125 58
  // 123.0441 20532.421875 272
  // 123.0804 5761.97509765625 75
  { mz: 124.0519, intensity: 2745.683349609375, relIntensity: 35 },
  // 125.0597 40026.01953125 531
  // 128.0621 20955.919921875 277
  // 129.0699 32106.041015625 426
  // 130.0777 3098.933349609375 40
  // 131.0855 31542.384765625 418
  // 133.0648 20796.052734375 275
  // 133.1012 15603.5390625 206
  // 135.0441 5207.76025390625 68
  // 135.0804 23430.94921875 310
  // 137.0597 43228.1953125 574
  { mz: 141.0699, intensity: 17101.447265625, relIntensity: 226 },
  // 142.0777 32443.224609375 430
  // 143.0855 19918.123046875 264
  // 144.0934 3655.91552734375 47
  // 145.0648 23680.845703125 314
  // 145.1012 31850.689453125 422
  // 146.0726 10975.16796875 145
  // 147.0804 26729.390625 354
  // 147.1168 3551.9990234375 46
  // 149.0597 5422.45751953125 71
  // 149.0961 15913.8427734375 210
  // 151.039 5507.88818359375 72
  // 153.0699 4348.8818359375 56
  // 154.0777 11228.1982421875 148
  { mz: 155.0855, intensity: 10365.6708984375, relIntensity: 136 },
  // 156.0934 3863.8662109375 50
  // 157.0648 10645.9541015625 140
  // 157.1012 31209.603515625 414
  // 158.0726 19896.779296875 263
  // 158.9275 19771.025390625 262
  // 159.0804 41365.10546875 549
  // 159.1168 4615.49462890625 60
  // 160.0883 11363.736328125 150
  // 161.0597 42139.65234375 559
  // 161.0961 30126.310546875 399
  // 162.0675 11338.2802734375 149
  // 163.0754 11383.9853515625 150
  // 167.0855 4863.29150390625 63
  // 169.1012 5448.23779296875 71
  // 170.0726 3489.041015625 45
  // 171.0804 5152.2255859375 67
  // 172.0883 13807.0859375 182
  // 173.0597 4113.93701171875 53
  // 173.0961 27073.767578125 359
  // 174.0675 19037.427734375 252
  { mz: 175.0754, intensity: 75161.890625, relIntensity: 999 },
  // 175.1118 15881.8955078125 210
  // 176.9377 58996.4453125 783
  // 177.091 12415.5068359375 164
  { mz: 181.0648, intensity: 3173.784423828125, relIntensity: 41 },
  // 182.0726 4729.642578125 61
  // 185.0961 16492.298828125 218
  // 187.0754 5285.57470703125 69
  // 187.1118 4403.12109375 57
  // 188.0832 11923.1982421875 157
  // 189.091 17500.26171875 231
  { mz: 194.9484, intensity: 36542.01953125, relIntensity: 485 },
  // 198.0675 5262.3876953125 69
  // 201.091 14209.2626953125 188
  // 203.0703 5157.29052734375 67
  { mz: 203.1067, intensity: 14684.021484375, relIntensity: 194 },
  // 204.9326 23151.77734375 307
  // 213.091 9839.451171875 129
  { mz: 219.2034, intensity: 2953.314697265625, relIntensity: 38 },
  // 222.9431 14347.0166015625 189
  // 231.1016 15841.099609375 209
  { mz: 232.9273, intensity: 5384.43310546875, relIntensity: 70 },
  { mz: 250.9387, intensity: 5492.98291015625, relIntensity: 72 },
];

function InfoTable({ record, className = 'InfoTable' }: InputProps) {
  console.log(record);

  const infoTable = useMemo(
    () => (
      <div className={className}>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accession</td>
              <td>{record.accession}</td>
            </tr>
            <tr>
              <td>Title</td>
              <td>{record.title}</td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{record.date.created}</td>
            </tr>
            <tr>
              <td>Authors</td>
              <td>{record.authors.map((a) => a.name).join(', ')}</td>
            </tr>
            <tr>
              <td style={{ borderBottom: '1px solid grey' }}>License</td>
              <td style={{ borderBottom: '1px solid grey' }}>
                {record.license}
              </td>
            </tr>
            <tr>
              <td>Mass</td>
              <td>{record.compound.mass}</td>
            </tr>
            <tr>
              <td>SPLASH</td>
              <td>{record.peak.splash}</td>
            </tr>
            <tr>
              <td>
                <span>Structure /</span>
                <br />
                <span>Spectrum</span>
              </td>
              <td>
                <div className="structure-spectrum-view">
                  <td>
                    {record.compound.smiles && record.compound.smiles !== '' ? (
                      <StructureView
                        smiles={record.compound.smiles}
                        imageWidth={400}
                        imageHeight={400}
                      />
                    ) : undefined}
                  </td>
                  <Chart peakData={peakData} width={600} height={400} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Formula</td>
              <td>
                <MF mf={record.compound.formula} />{' '}
              </td>
            </tr>
            <tr>
              <td>Names</td>
              <td>{record.compound.names}</td>
            </tr>
            <tr>
              <td>Classes</td>
              <td>{record.compound.classes}</td>
            </tr>
            <tr>
              <td>InChI</td>
              <td>{record.compound.inchi}</td>
            </tr>
            <tr>
              <td style={{ borderBottom: '1px solid grey' }}>SMILES</td>
              <td style={{ borderBottom: '1px solid grey' }}>
                {record.compound.smiles}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    [
      className,
      record.accession,
      record.authors,
      record.compound.classes,
      record.compound.formula,
      record.compound.inchi,
      record.compound.mass,
      record.compound.names,
      record.compound.smiles,
      record.date.created,
      record.license,
      record.peak.splash,
      record.title,
    ],
  );

  return infoTable;
}

export default InfoTable;
