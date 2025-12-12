import Table from '../basic/Table';
import Link from '../../types/Link';
import { CSSProperties, JSX, useMemo } from 'react';
import ExportableContent from '../common/ExportableContent';
import copyTextToClipboard from '../../utils/copyTextToClipboard';
import { usePropertiesContext } from '../../context/properties/properties';
import buildSearchUrl from '../../utils/buildSearchUrl';

type InputProps = {
  links: Link[] | undefined;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  title?: string | JSX.Element;
};

function LinksTable({ links, width, height, title }: InputProps) {
  const { baseUrl, frontendUrl } = usePropertiesContext();

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
            title={`Copy '${link.database}' to clipboard`}
            component={link.identifier}
            onClick={() => copyTextToClipboard(link.database, link.identifier)}
            enableSearch={link.database === 'INCHIKEY'}
            searchTitle="Search for InChIKey"
            searchUrl={buildSearchUrl(
              'inchi_key',
              link.identifier,
              baseUrl,
              frontendUrl,
            )}
          />
        ),
      }),
    );

    return (
      <Table
        tableName="Links Table"
        columns={columns}
        dataSource={dataSource}
        style={{ width, height }}
        title={title}
        enableExport
      />
    );
  }, [baseUrl, frontendUrl, height, links, title, width]);
}

export default LinksTable;
