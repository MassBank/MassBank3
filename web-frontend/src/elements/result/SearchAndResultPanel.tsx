import { Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ResultTableSortOptionType from '../../types/ResultTableSortOptionType';
import resultTableSortOptionValues from '../../constants/resultTableSortOptionValues';
import ResultPanel from './ResultPanel';
import Hit from '../../types/Hit';
import Peak from '../../types/peak/Peak';
import Placeholder from '../basic/Placeholder';

type InputProps = {
  searchPanel: JSX.Element;
  width: number;
  height: number;
  searchPanelWidth: number;
  searchPanelHeight: number;
  widthOverview: number;
  heightOverview: number;
  isRequesting: boolean;
  reference: Peak[];
  hits: Hit[];
};

function SearchAndResultPanel({
  searchPanel,
  width,
  height,
  searchPanelWidth,
  searchPanelHeight,
  widthOverview,
  heightOverview,
  isRequesting,
  reference,
  hits,
}: InputProps) {
  const [innerHits, setInnerHits] = useState<Hit[]>([]);

  useEffect(() => {
    setInnerHits(hits);
  }, [hits]);

  const [wasRequesting, setWasRequesting] = useState<boolean>(false);

  useEffect(() => {
    if (isRequesting) {
      setWasRequesting(true);
    }
  }, [isRequesting]);

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
          {isRequesting ? (
            <Spin size="large" />
          ) : innerHits.length > 0 ? (
            resultPanel
          ) : (
            <Placeholder
              child={
                wasRequesting
                  ? 'No hits found'
                  : "Click 'Submit' to start searching"
              }
              style={{ width, height, fontSize: 18, fontWeight: 'bold' }}
            />
          )}
        </Content>
      </Content>
    ),
    [
      height,
      innerHits.length,
      isRequesting,
      resultPanel,
      searchPanel,
      searchPanelWidth,
      wasRequesting,
      width,
    ],
  );
}

export default SearchAndResultPanel;
