import { Content } from 'antd/es/layout/layout';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout, Spin } from 'antd';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Placeholder from '../../../basic/Placeholder';
import Segmented from '../../../basic/Segmented';
import SectionDivider from '../../../basic/SectionDivider';

type LabelValueType = {
  label: string;
  value: string;
};

const markDownUrls: LabelValueType[] = [
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

function Documentation() {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [markDowns, setMarkDowns] = useState<LabelValueType[]>([]);

  const fetchMarkDowns = useCallback(async () => {
    setIsFetching(true);

    try {
      const _markDowns: LabelValueType[] = [];
      for (const entry of markDownUrls) {
        const response = await fetch(entry.value);
        const md = await response.text();

        _markDowns.push({ label: entry.label, value: md });
      }
      setMarkDowns(_markDowns);
    } catch (e) {
      console.error(e);
    }

    setIsFetching(false);
  }, []);

  useEffect(() => {
    fetchMarkDowns();
  }, [fetchMarkDowns]);

  const elements = useMemo(
    () =>
      markDowns.map((entry) => (
        <Content
          key={'markdown-entry-' + entry.label}
          style={{ width: '100%', height: '100%', padding: 10 }}
        >
          <SectionDivider label={entry.label} />
          <Markdown remarkPlugins={[remarkGfm]} children={entry.value} />
        </Content>
      )),
    [markDowns],
  );

  const elementLabels = useMemo(
    () => markDowns.map((entry) => entry.label),
    [markDowns],
  );

  return useMemo(
    () => (
      <Layout
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isFetching ? (
            <Spin
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              size="large"
            />
          ) : markDowns.length > 0 ? (
            <Segmented elements={elements} elementLabels={elementLabels} />
          ) : (
            <Placeholder
              child="Could not fetch documentation data"
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </Content>
      </Layout>
    ),
    [elementLabels, elements, isFetching, markDowns.length],
  );
}

export default Documentation;
