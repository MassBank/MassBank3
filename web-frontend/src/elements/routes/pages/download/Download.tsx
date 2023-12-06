import './Download.scss';

function Download() {
  return (
    <div className="download-panel">
      <p>
        Get the latest MassBank data from our{' '}
        {
          <a
            href="https://github.com/MassBank/MassBank-data/releases/latest"
            target="_blank"
          >
            GitHub
          </a>
        }{' '}
        repository.
      </p>
    </div>
  );
}

export default Download;
