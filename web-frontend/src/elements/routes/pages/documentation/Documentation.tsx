import { Content } from 'antd/es/layout/layout';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Spin, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { splitStringAndJoin } from '../../../../utils/stringUtils';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import Placeholder from '../../../basic/Placeholder';

const tabsHeight = 50;

type labelValueType = {
  label: string;
  value: string;
};

const markDownUrls: labelValueType[] = [
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
  const ref = useRef(null);
  const { height } = useContainerDimensions(ref);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [markDowns, setMarkDowns] = useState<labelValueType[]>([]);
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  const handleOnChange = useCallback((key: string) => {
    setActiveKey(key);
  }, []);

  const fetchMarkDowns = useCallback(async () => {
    setIsLoading(true);

    try {
      markDownUrls.forEach(async (entry) => {
        const response = await fetch(entry.value);
        const md = await response.text();

        setMarkDowns((prev) => [
          ...prev,
          {
            label: entry.label,
            value: md,
          },
        ]);
      });
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMarkDowns();
  }, [fetchMarkDowns]);

  const items: TabsProps['items'] = useMemo(
    () =>
      markDowns.map((entry) => ({
        key: entry.label,
        label: splitStringAndJoin(entry.label, '_', ' '),
        children: (
          <Content
            style={{
              width: '100%',
              height: height - tabsHeight,
              display: 'block',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'scroll',
            }}
          >
            <Markdown remarkPlugins={[remarkGfm]} children={entry.value} />
          </Content>
        ),
      })),
    [height, markDowns],
  );

  return useMemo(
    () => (
      <Content
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isLoading ? (
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
          <Tabs
            activeKey={activeKey}
            items={items}
            onChange={handleOnChange}
            tabBarStyle={{
              width: '100%',
              height: tabsHeight,
              padding: 0,
              margin: 0,
              backgroundColor: '#f3ece0',
            }}
            centered
          />
        ) : (
          <Placeholder
            child="Could not fetch documentation data"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </Content>
    ),
    [activeKey, handleOnChange, isLoading, items, markDowns.length],
  );
}

export default Documentation;
