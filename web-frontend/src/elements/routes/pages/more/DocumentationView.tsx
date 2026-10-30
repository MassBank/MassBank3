import { Content } from 'antd/es/layout/layout';
import { useMemo } from 'react';
import SectionDivider from '../../../basic/SectionDivider';

type LabelValueType = {
  label: string;
  value: string;
};

const documentationLinks: LabelValueType[] = [
  {
    label: 'User',
    value:
      'https://massbank.github.io/MassBank-documentation/user_documentation.md',
  },
  {
    label: 'Contributor',
    value:
      'https://massbank.github.io/MassBank-documentation/contributor_documentation.md',
  },
  {
    label: 'Developer',
    value:
      'https://massbank.github.io/MassBank-documentation/developer_documentation.md',
  },
  {
    label: 'Command Line Tools',
    value: 'https://massbank.github.io/MassBank-documentation/cli_reference.md',
  },
];

function DocumentationView() {
  return useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Content style={{ width: '100%', height: '100%', padding: 10 }}>
          <SectionDivider label="Documentation" />
          {documentationLinks.map((entry) => (
            <p key={entry.label}>
              <a href={entry.value} target="_blank" rel="noopener noreferrer">
                {entry.label}
              </a>
            </p>
          ))}
        </Content>
      </Content>
    ),
    [],
  );
}

export default DocumentationView;
