import { useRef } from 'react';
import { Typography } from 'antd';
const { Paragraph } = Typography;
import { Content } from 'antd/es/layout/layout';
import useContainerDimensions from '../../../../utils/useContainerDimensions';

import denbiLogo from '../../../../assets/deNBI.png';
import eawagLogo from '../../../../assets/EAWAG_logo.png';
import uniLuxLogo from '../../../../assets/UniLu-LCSB_Logo.png';
import ipbLogo from '../../../../assets/IPB.png';
import normanLogo from '../../../../assets/NORMAN.png';
import fnrLogo from '../../../../assets/fnr_logo.png';
import hbm4euLogo from '../../../../assets/HBM4EU_logo.png';
import nfdi4chemLogo from '../../../../assets/nfdi4chem_logo.png';
import ufzLogo from '../../../../assets/UFZ.png';
import SectionDivider from '../../../basic/SectionDivider';
import ServiceStatusView from './ServiceStatusView';

const logos = [
  denbiLogo,
  eawagLogo,
  fnrLogo,
  ipbLogo,
  normanLogo,
  ufzLogo,
  uniLuxLogo,
  hbm4euLogo,
  nfdi4chemLogo,
];

function AboutView() {
  const ref = useRef(null);
  const { width } = useContainerDimensions(ref);

  return (
    <Content
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'scroll',
      }}
    >
      <Paragraph style={{ padding: 10 }}>
        MassBank is an open source mass spectral library for the identification
        of small chemical molecules of metabolomics, exposomics and
        environmental relevance. The vast majority of MassBank contents now
        features high-resolution mass spectrometry data, although all kinds of
        mass spectral data are accepted. A range of search options are available
        for browsing the data. The MassBank library is based on text file
        records containing the record metadata and the mass spectral information
        in the MassBank record format. All data is archived on GitHub and
        Zenodo; the code is also on GitHub. The MassBank library can be
        downloaded in different formats such as text records, database files
        (sql) and MSP files.
      </Paragraph>
      <Paragraph style={{ padding: 10 }}>
        MassBank is maintained and developed by the MassBank consortium and is
        supported by the NORMAN Association, FNR and NFDI4Chem. The main
        sustainers and developers of MassBank and related tools are the team of
        Steffen Neumann (Leibniz Institute of Plant Biochemistry. IPB,
        Halle/Saale, Germany), Michael Stravs (Swiss Federal Institute of
        Aquatic Science and Technology, EAWAG, Dübendorf, Switzerland), Emma
        Schymanski (Luxembourg Centre for Systems Biomedicine, University of
        Luxembourg, LCSB, Belvaux, Luxembourg), and Tobias Schulze (Helmholtz
        Centre for Environmental Research, UFZ, Leipzig, Germany).
      </Paragraph>

      <SectionDivider label="Our supporters" />
      <Content
        style={{
          width: '100%',
          display: 'grid',
          gridGap: 10,
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
        }}
      >
        {logos.map((logo, i) => (
          <img
            src={logo}
            style={{ width: width / 5, maxHeight: 120 }}
            key={'supporter-logo-' + i}
          />
        ))}
      </Content>
      <SectionDivider label="Service Status" />
      <ServiceStatusView />
    </Content>
  );
  // return (
  //   <div className="about-view">
  //     <h2>About View</h2>
  //     <div className="documentation-container">
  //       <p>
  //         A documentation is accessible at our{' '}
  //         {
  //           <a
  //             href="https://massbank.github.io/MassBank-documentation/"
  //             target="_blank"
  //           >
  //             GitHub
  //           </a>
  //         }{' '}
  //         repository.
  //       </p>
  //     </div>
  //     <div className="download-container">
  //       <p>
  //         Get the latest MassBank data from our{' '}
  //         {
  //           <a
  //             href="https://github.com/MassBank/MassBank-data/releases/latest"
  //             target="_blank"
  //           >
  //             GitHub
  //           </a>
  //         }{' '}
  //         repository.
  //       </p>
  //     </div>
  //     <div className="documentation-container">
  //       <p>
  //         Standing on the shoulder of giants, we would like to acknowledge some
  //         of the dependencies used in the MassBank system:
  //         <ul>
  //           <li>
  //             {<a href="https://cdk.github.io/">CDK</a>}: Willighagen et al. The
  //             Chemistry Development Kit (CDK) v2.0: atom typing, depiction,
  //             molecular formulas, and substructure searching. J. Cheminform.
  //             2017; 9(3),{' '}
  //             {
  //               <a
  //                 href="https://doi.org/10.1186/s13321-017-0220-4"
  //                 target="_blank"
  //               >
  //                 doi:10.1186/s13321-017-0220-4
  //               </a>
  //             }
  //           </li>
  //           <li>
  //             {<a href="https://github.com/matchms">matchms</a>}:
  //             <ul>
  //               <li>
  //                 F Huber, S. Verhoeven, C. Meijer, H. Spreeuw, E. M. Villanueva
  //                 Castilla, C. Geng, J.J.J. van der Hooft, S. Rogers, A.
  //                 Belloum, F. Diblen, J.H. Spaaks, (2020). matchms - processing
  //                 and similarity evaluation of mass spectrometry data. Journal
  //                 of Open Source Software, 5(52), 2411,
  //                 <a href="https://doi.org/10.21105/joss.02411}">
  //                   doi:10.21105/joss.02411
  //                 </a>
  //               </li>
  //               <li>
  //                 de Jonge NF, Hecht H, Michael Strobel, Mingxun Wang, van der
  //                 Hooft JJJ, Huber F. (2024). Reproducible MS/MS library
  //                 cleaning pipeline in matchms. Journal of Cheminformatics,
  //                 2024,
  //                 {
  //                   <a
  //                     href="https://doi.org/10.1186/s13321-024-00878-1"
  //                     target="_blank"
  //                   >
  //                     doi:10.1186/s13321-024-00878-1
  //                   </a>
  //                 }
  //               </li>
  //             </ul>
  //           </li>
  //           {/* <li>Zakodium components: ...</li> */}
  //           {/* <li>
  //             Further components: please check the source code and
  //             configurations in our GitHub repository
  //           </li> */}
  //         </ul>
  //       </p>
  //     </div>
  //   </div>
  // );
}

export default AboutView;
