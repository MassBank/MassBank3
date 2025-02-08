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
  hits: Hit[];
  isRequesting: boolean;
  reference?: Peak[];
};

function SearchAndResultPanel({
  searchPanel,
  width,
  height,
  searchPanelWidth,
  searchPanelHeight,
  widthOverview,
  heightOverview,
  hits,
  isRequesting,
  reference = [],
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
          {!isRequesting && (
            <Content
              style={{
                width: width - searchPanelWidth,
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
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
            </Content>
          )}
        </Content>
      </Content>
    ),
    [
      handleOnSelectSort,
      height,
      heightOverview,
      innerHits,
      isRequesting,
      reference,
      searchPanel,
      searchPanelHeight,
      searchPanelWidth,
      sortOptions,
      width,
      widthOverview,
    ],
  );
}

export default SearchAndResultPanel;
