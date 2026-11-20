import { Content } from 'antd/es/layout/layout';
import { memo } from 'react';

import eawagLogo from '../../../../assets/EAWAG_logo.png';
import uniLuxLogo from '../../../../assets/UniLu-LCSB_Logo.png';
import ipbLogo from '../../../../assets/IPB.png';
import normanLogo from '../../../../assets/NORMAN.png';
import fnrLogo from '../../../../assets/fnr_logo.png';
import hbm4euLogo from '../../../../assets/HBM4EU_logo.png';
import nfdi4chemLogo from '../../../../assets/nfdi4chem_logo.png';
import ufzLogo from '../../../../assets/UFZ.png';
import kakenhiLogo from '../../../../assets/KAKENHIlogo_L.jpg';
import mssjLogo from '../../../../assets/logo-mssj.png';

const logos: { name: string; src: string }[] = [
  { name: 'Eawag', src: eawagLogo },
  { name: 'FNR', src: fnrLogo },
  { name: 'IPB Halle', src: ipbLogo },
  { name: 'NORMAN', src: normanLogo },
  { name: 'UFZ Leipzig', src: ufzLogo },
  { name: 'UniLux', src: uniLuxLogo },
  { name: 'HBM4EU', src: hbm4euLogo },
  { name: 'NFDI4Chem', src: nfdi4chemLogo },
  { name: 'KAKENHI', src: kakenhiLogo },
  { name: 'MSSJ', src: mssjLogo },
];

function Supporters() {
  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridGap: 10,
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <a
          href="https://www.surveymonkey.de/r/denbi-service?sc=cibi&tool=massbank"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: 200,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '12px 10px',
            backgroundColor: '#14387F',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            textDecoration: 'none',
            textAlign: 'center',
            borderRadius: 10,
            borderBottom: '4px solid #009BD9',
            boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
            boxSizing: 'border-box',
          }}
        >
          <img
            src="https://www.denbi.de/templates/nbimaster/img/denbi-logo-color.svg"
            alt="de.NBI Logo"
            width={110}
            style={{
              display: 'block',
              width: 110,
              maxWidth: '100%',
              height: 'auto',
              padding: 8,
              backgroundColor: '#ffffff',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: '#8DDEFF',
            }}
          >
            ✓ Approved de.NBI Service
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#ffffff',
              whiteSpace: 'normal',
            }}
          >
            Share your feedback ↗
          </span>
        </a>
        {logos.map((logo, i) => (
          <img
            src={logo.src}
            style={{ width: 200 }}
            key={'supporter-logo-' + i + '-' + logo.name}
            alt={logo.name + ' supporter logo'}
          />
        ))}
      </Content>
    </Content>
  );
}

export default memo(Supporters);
