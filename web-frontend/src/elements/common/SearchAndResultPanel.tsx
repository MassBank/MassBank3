import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import ResultTableSortOptionType from '../../types/ResultTableSortOptionType';
import resultTableSortOptionValues from '../../constants/resultTableSortOptionValues';
import ResultPanel from '../result/ResultPanel';
import Hit from '../../types/Hit';
import Peak from '../../types/peak/Peak';
import { Spin } from 'antd';

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
    setInnerHits(hits);
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
    (value: string) => {
      const _hits = [...hits];
      _hits.sort((a, b) => {
        if (value === 'index') {
          return a.index - b.index;
        } else if (value === 'index_desc') {
          return b.index - a.index;
        } else if (value === 'score') {
          return b.score !== undefined && a.score !== undefined
            ? b.score - a.score
            : 0;
        } else if (value === 'score_asc') {
          return a.score !== undefined && b.score !== undefined
            ? a.score - b.score
            : 0;
        } else if (value === 'accession') {
          return a.accession.localeCompare(b.accession, undefined, {
            sensitivity: 'variant',
          });
        } else if (value === 'accession_desc') {
          return b.accession.localeCompare(a.accession, undefined, {
            sensitivity: 'variant',
          });
        } else if (value === 'title') {
          return a.record !== undefined && b.record !== undefined
            ? a.record.title.localeCompare(b.record.title, undefined, {
                sensitivity: 'variant',
              })
            : 0;
        } else if (value === 'title_desc') {
          return b.record !== undefined && a.record !== undefined
            ? b.record.title.localeCompare(a.record.title, undefined, {
                sensitivity: 'variant',
              })
            : 0;
        }

        return 0;
      });

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
