import { CSSProperties, useMemo } from 'react';
import SubTag from '../../types/record/SubTag';
import Table from '../basic/Table';

type InputProps = {
  comments: SubTag[] | undefined;
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
        dataIndex: 'Comment',
        key: 'comment',
        align: 'center' as const,
      },
      {
        title: 'Text',
        dataIndex: 'Text',
        key: 'text',
        align: 'center' as const,
      },
    ];

    const dataSource: { [key: string]: string }[] = [];
    comments.forEach((comment, i) =>
      dataSource.push({
        key: `comments-key-${i}`,
        Comment: comment.subtag,
        Text: comment.value,
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
