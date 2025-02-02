import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ResultTableSortOptionType from '../../types/ResultTableSortOptionType';
import resultTableSortOptionValues from '../../constants/resultTableSortOptionValues';
import ResultPanel from '../result/ResultPanel';
import Hit from '../../types/Hit';
import Peak from '../../types/peak/Peak';
import { Spin } from 'antd';
import sortHits from '../../utils/sortHits';
import ResultTableSortOption from '../../types/ResultTableSortOption';

type InputProps = {
  searchPanel: JSX.Element;
  width: number;
  height: number;
  searchPanelWidth: number;
  searchPanelHeight: number;
  widthOverview: number;
  heightOverview: number;
  reference: Peak[];
  hits: Hit[];
  isRequesting: boolean;
};

function SearchAndResultPanel({
  searchPanel,
  width,
  height,
  searchPanelWidth,
  searchPanelHeight,
  widthOverview,
  heightOverview,
  reference,
  hits,
  isRequesting,
}: InputProps) {
  const [innerHits, setInnerHits] = useState<Hit[]>([]);

  useEffect(() => {
    setInnerHits([...hits]);
  }, [hits]);

  const sortOptions = useMemo(() => {
    const _sortOptions: ResultTableSortOptionType[] = [];
    Object.keys(resultTableSortOptionValues).forEach((key: string) => {
      _sortOptions.push({
        value: key,
        label: resultTableSortOptionValues[key],
      });
      if (key === 'score') {
        _sortOptions.push({
          value: key + '_asc',
          label: resultTableSortOptionValues[key] + ' (asc)',
        });
      } else {
        _sortOptions.push({
          value: key + '_desc',
          label: resultTableSortOptionValues[key] + ' (desc)',
        });
      }
    });

    return _sortOptions;
  }, []);

  const handleOnSelectSort = useCallback(
    (sortValue: ResultTableSortOption) => {
      const _hits = sortHits(hits, sortValue);
      setInnerHits(_hits);
    },
    [hits],
  );

  const resultPanel = useMemo(() => {
    return (
      <ResultPanel
        reference={reference}
        hits={innerHits}
        width={width - searchPanelWidth}
        height={searchPanelHeight}
        sortOptions={sortOptions}
        onSort={handleOnSelectSort}
        widthOverview={widthOverview}
        heightOverview={heightOverview}
      />
    );
  }, [
    handleOnSelectSort,
    heightOverview,
    innerHits,
    reference,
    searchPanelHeight,
    searchPanelWidth,
    sortOptions,
    width,
    widthOverview,
  ]);

  return useMemo(
    () => (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        <Sider width={searchPanelWidth}>{searchPanel}</Sider>
        <Content
          style={{
            width: width - searchPanelWidth,
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin size="large" spinning={isRequesting} />
          <Content
            style={{
              width: width - searchPanelWidth,
              height: '100%',
              display: isRequesting ? 'none' : 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {resultPanel}
          </Content>
        </Content>
      </Content>
    ),
    [height, isRequesting, resultPanel, searchPanel, searchPanelWidth, width],
  );
}

export default SearchAndResultPanel;
