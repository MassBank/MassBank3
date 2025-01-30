import './Table.scss';

import { Table } from 'antd';
import Link from '../../types/Link';
import { CSSProperties, JSX, useCallback, useMemo } from 'react';
import ExportableContent from '../common/ExportableContent';
import copyTextToClipboard from '../../utils/copyTextToClipboard';
import routes from '../../constants/routes';
import { usePropertiesContext } from '../../context/properties/properties';

type InputProps = {
  links: Link[] | undefined;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  title?: string | JSX.Element;
};

function LinksTable({ links, width, height, title }: InputProps) {
  const { baseUrl, frontendUrl } = usePropertiesContext();

  const buildSearchUrl = useCallback(
    (label: string, value: string) => {
      const searchParams = new URLSearchParams();
      searchParams.set(label, value);
      const url =
        frontendUrl +
        baseUrl +
        routes.search.path +
        `?${searchParams.toString()}`;

      return url;
    },
    [baseUrl, frontendUrl],
  );

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
    links.forEach((link, i) =>
      dataSource.push({
        key: `links-key-${i}`,
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
      }),
    );

    return (
      <Table
        className="table"
        style={{ width, height }}
        sticky
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        title={title ? () => title : undefined}
      />
    );
  }, [buildSearchUrl, height, links, title, width]);
}

export default LinksTable;
