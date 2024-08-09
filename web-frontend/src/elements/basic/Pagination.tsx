import './Pagination.scss';
import 'react-responsive-pagination/themes/classic.css';

import ResponsivePaginationComponent from 'react-responsive-pagination';
import { CSSProperties, useState } from 'react';

type InputProps = {
  total: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (pageIndex: number) => void;
  style?: CSSProperties;
};

function Pagination({ total, onPageChange, style }: InputProps) {
  const [current, setCurrent] = useState<number>(1);

  const handleOnPageChange = (pageIndex: number) => {
    setCurrent(pageIndex);
    onPageChange(pageIndex);
  };

  return (
    <div className="pagination-container" style={style}>
      <ResponsivePaginationComponent
        current={current}
        total={total}
        onPageChange={handleOnPageChange}
      />
    </div>
  );
}

export default Pagination;
