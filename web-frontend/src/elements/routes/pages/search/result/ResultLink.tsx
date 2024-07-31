import './ResultLink.scss';

import Hit from '../../../../../types/Hit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

type InputProps = {
  hit: Hit;
};

function ResultLink({ hit }: InputProps) {
  const url =
    import.meta.env.VITE_MB3_FRONTEND_URL +
    import.meta.env.VITE_MB3_BASE_URL +
    'recordDisplay?id=' +
    hit.accession;

  return (
    hit.record && (
      <div className="link-container">
        <label>{hit.record.title}</label>
        <a
          className="link"
          href={hit.accession && hit.accession !== '' ? url : '?'}
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faExternalLink} title={hit.record.title} />
        </a>
      </div>
    )
  );
}

export default ResultLink;
