import './Table.scss';

import { Table } from 'antd';
import Link from '../../types/Link';
import { CSSProperties, useCallback, useMemo } from 'react';
import ExportableContent from '../common/ExportableContent';
import copyTextToClipboard from '../../utils/copyTextToClipboard';
import routes from '../../constants/routes';

type InputProps = {
  links: Link[] | undefined;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function LinksTable({ links, width, height }: InputProps) {
  const buildSearchUrl = useCallback((label: string, value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(label, value);
    const url =
      ((import.meta.env.VITE_MB3_FRONTEND_URL +
        routes.find((r) => r.id === 'Search')?.path) as string) +
      `?${searchParams.toString()}`;

    return url;
  }, []);

  return useMemo(() => {
    if (!links || links.length === 0) {
      return null;
    }

    const columns = [
      {
        title: 'Database',
        dataIndex: 'Database',
        key: 'database',
        align: 'center' as const,
      },
      {
        title: 'Identifier',
        dataIndex: 'Identifier',
        key: 'identifier',
        align: 'center' as const,
      },
    ];

    const dataSource: { [key: string]: string | JSX.Element }[] = [];
    links.forEach((link, i) => {
      dataSource.push({
        Database: link.database,
        Identifier: (
          <ExportableContent
            mode="copy"
            title={`Copy '${link.identifier}' to clipboard`}
            component={link.identifier}
            onClick={() => copyTextToClipboard(link.database, link.identifier)}
            enableSearch={link.database === 'INCHIKEY'}
            searchTitle="Search for this InChIKey"
            searchUrl={buildSearchUrl('inchi', link.identifier)}
          />
        ),
        key: `links-key-${i}`,
      });
    });

    return (
      <Table
        className="table"
        style={{ width, height }}
        sticky
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }, [buildSearchUrl, height, links, width]);
}

export default LinksTable;
