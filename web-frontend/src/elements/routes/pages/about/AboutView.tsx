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
      <div className="documentation-container">
        <p>
          Standing on the shoulder of giants, we would like to acknowledge some
          of the dependencies used in the MassBank system:
          <ul>
            <li>
              {<a href="https://cdk.github.io/">CDK</a>}: Willighagen et al. The
              Chemistry Development Kit (CDK) v2.0: atom typing, depiction,
              molecular formulas, and substructure searching. J. Cheminform.
              2017; 9(3),{' '}
              {
                <a
                  href="https://doi.org/10.1186/s13321-017-0220-4"
                  target="_blank"
                >
                  doi:10.1186/s13321-017-0220-4
                </a>
              }
            </li>
            <li>
              {<a href="https://github.com/matchms">matchms</a>}:
              <ul>
                <li>
                  F Huber, S. Verhoeven, C. Meijer, H. Spreeuw, E. M. Villanueva
                  Castilla, C. Geng, J.J.J. van der Hooft, S. Rogers, A.
                  Belloum, F. Diblen, J.H. Spaaks, (2020). matchms - processing
                  and similarity evaluation of mass spectrometry data. Journal
                  of Open Source Software, 5(52), 2411,
                  <a href="https://doi.org/10.21105/joss.02411}">
                    doi:10.21105/joss.02411
                  </a>
                </li>
                <li>
                  de Jonge NF, Hecht H, Michael Strobel, Mingxun Wang, van der
                  Hooft JJJ, Huber F. (2024). Reproducible MS/MS library
                  cleaning pipeline in matchms. Journal of Cheminformatics,
                  2024,
                  {
                    <a
                      href="https://doi.org/10.1186/s13321-024-00878-1"
                      target="_blank"
                    >
                      doi:10.1186/s13321-024-00878-1
                    </a>
                  }
                </li>
              </ul>
            </li>
            {/* <li>Zakodium components: ...</li> */}
            {/* <li>
              Further components: please check the source code and
              configurations in our GitHub repository
            </li> */}
          </ul>
        </p>
      </div>
    </div>
  );
}

export default AboutView;
