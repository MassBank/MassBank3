import './AboutView.scss';

function AboutView() {
  return (
    <div className="about-view">
      <h2>About View</h2>
      <div className="documentation-container">
        <p>
          A documentation is accessible at our{' '}
          {
            <a
              href="https://massbank.github.io/MassBank-documentation/"
              target="_blank"
            >
              GitHub
            </a>
          }{' '}
          repository.
        </p>
      </div>
      <div className="download-container">
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
    </div>
  );
}

export default AboutView;
