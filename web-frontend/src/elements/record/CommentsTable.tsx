import { CSSProperties, useMemo } from 'react';
import Table from '../basic/Table';

type InputProps = {
  comments: string[] | undefined;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function CommentsTable({ comments, width, height }: InputProps) {
  return useMemo(() => {
    if (!comments || comments.length === 0) {
      return null;
    }

    const columns = [
      {
        title: 'Comment',
        dataIndex: 'Text',
        key: 'comment',
        align: 'center' as const,
        onCell: () => ({ style: { whiteSpace: 'pre-wrap' as const } }),
      },
    ];

    const dataSource: { [key: string]: string }[] = [];
    comments.forEach((comment, i) =>
      dataSource.push({
        key: `comments-key-${i}`,
        Text: comment,
      }),
    );

    return (
      <Table
        tableName="Comments Table"
        columns={columns}
        dataSource={dataSource}
        style={{ width, height }}
        enableExport
      />
    );
  }, [comments, height, width]);
}

export default CommentsTable;
