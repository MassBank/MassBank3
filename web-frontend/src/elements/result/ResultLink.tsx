import './ResultLink.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import Hit from '../../types/Hit';

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
