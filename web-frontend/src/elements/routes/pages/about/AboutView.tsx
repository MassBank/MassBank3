import { Content } from 'antd/es/layout/layout';

function AboutView() {
  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2 style={{ width: '100%', height: '20%', textAlign: 'center' }}>
        About View
      </h2>
      <Content
        style={{
          width: '100%',
          height: '40%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
      </Content>
      <Content
        style={{
          width: '100%',
          height: '40%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
      </Content>
    </Content>
  );
}

export default AboutView;
