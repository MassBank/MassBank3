import './ResultPanel.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Hit from '../../../../../types/Hit';
import Record from '../../../../../types/Record';
import generateID from '../../../../../utils/generateID';
import axios from 'axios';
import ResultCard from './ResultCard';
import Peak from '../../../../../types/peak/Peak';
import CustomModal from '../../../../basic/CustomModal';
import SpectralHitsCarouselView from '../SpectralHitsCarouselView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type InputProps = {
  hits: Hit[];
  reference: Peak[];
  width: number;
  height: number;
  widthOverview?: number;
  heightOverview?: number;
};

function ResultPanel({
  hits,
  reference,
  width,
  height,
  widthOverview = width,
  heightOverview = height,
}: InputProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hitsWithRecords, setHitsWithRecords] = useState<Hit[]>([]);
  const [selectedCardDeckIndex, setSelectedCardDeckIndex] = useState<number>(0);
  const [cardDecks, setCardDecks] = useState<JSX.Element[]>([]);
  // const handleOnSelectCardIndex = useCallback((index: number) => {
  //   setSelectedCardDeckIndex(index);
  // }, []);

  const selectedPageLimit = 10;

  const cardSize = useMemo(() => {
    return { width: width / 3 - 15, height: height * 0.6 };
  }, [height, width]);
  // const chartSize = useMemo(() => {
  //   return {
  //     width: (cardSize.width / 3) * 2 - 20,
  //     height: cardSize.height / 2,
  //   };
  // }, [cardSize.height, cardSize.width]);
  const imageSize = useMemo(() => {
    return {
      width: cardSize.width,
      height: cardSize.height / 2,
    };
  }, [cardSize.height, cardSize.width]);

  const fetchRecords = useCallback(async () => {
    if (hits.length > 0) {
      // const selectedPageLimit = 10;
      const from = 0;
      const to = 10;
      const range = to - from;
      console.log('getHitsWithRecords', from, to, range);

      const limit = range > hits.length ? hits.length : range;
      console.log('limit', limit);

      console.log('slice from', from, 'to', from + limit);

      const accessions = hits.slice(from, from + limit).map((h) => h.accession);

      const records: (Record | undefined)[] = [];
      for (const accession of accessions) {
        const url =
          import.meta.env.VITE_MB3_API_URL + '/v1/records/' + accession;
        const resp = await axios.get(url);
        if (resp.status === 200) {
          const record = await resp.data;
          record.peak.peak.values = record.peak.peak.values.map((p) => ({
            ...p,
            id: generateID(),
          }));
          records.push(record);
        } else {
          records.push(undefined);
        }
      }

      const _hitsWithRecords = hits.slice(from, from + limit).map((h, i) => {
        h.record = records[i];
        return h;
      });

      setHitsWithRecords(_hitsWithRecords);
    }
  }, [hits]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    const cardDeckData: Hit[][] = [];
    let counter = 0;
    let resultHits: Hit[] = [];

    for (let i = 0; i < hitsWithRecords.length; i++) {
      if (counter < selectedPageLimit) {
        counter++;
        resultHits.push(hitsWithRecords[i]);
      } else {
        cardDeckData.push(resultHits);
        resultHits = [hitsWithRecords[i]];
        counter = 1;
      }
    }
    if (resultHits.length > 0) {
      cardDeckData.push(resultHits);
    }

    let cardDeckIndex = selectedCardDeckIndex;
    if (cardDeckIndex >= cardDeckData.length) {
      cardDeckIndex = 0;
      setSelectedCardDeckIndex(cardDeckIndex);
    }

    const _cardDecks =
      cardDeckData.length > 0
        ? cardDeckData[cardDeckIndex].map((hit, i) => (
            <ResultCard
              key={`resultCard_${i}`}
              label={cardDeckIndex * selectedPageLimit + i + 1}
              // reference={reference}
              hit={hit}
              // chartWidth={chartSize.width}
              // chartHeight={chartSize.height}
              imageWidth={imageSize.width}
              imageHeight={imageSize.height}
              style={{
                minWidth: cardSize.width,
                maxWidth: cardSize.width,
                minHeight: cardSize.height,
                maxHeight: cardSize.height,
                marginLeft: '4px',
                marginBottom: '4px',
                border: 'solid 1px lightgrey',
              }}
              onDoubleClick={() => {
                setShowModal(true);
              }}
            />
          ))
        : [];

    setCardDecks(_cardDecks);
  }, [
    selectedCardDeckIndex,
    hitsWithRecords,
    reference,
    imageSize.width,
    imageSize.height,
    cardSize.width,
    cardSize.height,
  ]);

  const spectralHitsCarouselView = useMemo(
    () => (
      <SpectralHitsCarouselView
        reference={reference}
        hits={hitsWithRecords}
        width={widthOverview}
        height={heightOverview - 50}
      />
    ),
    [heightOverview, hitsWithRecords, reference, widthOverview],
  );

  const customModal = useMemo(
    () => (
      <CustomModal
        show={showModal}
        body={spectralHitsCarouselView}
        onClose={() => setShowModal(false)}
        modalStyle={{
          content: { width: widthOverview, height: heightOverview },
        }}
        header={
          <FontAwesomeIcon
            icon={faTimes}
            style={{ color: 'red', cursor: 'pointer', paddingRight: '20px' }}
            onClick={() => setShowModal(false)}
          />
        }
        headerContainerStyle={{
          width: '100%',
          height: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
        footerContainerStyle={{ display: 'none' }}
      />
    ),
    [heightOverview, showModal, spectralHitsCarouselView, widthOverview],
  );

  return (
    <div className="result-container" style={{ width, height }}>
      {customModal}
      <div className="card-deck-container">{cardDecks}</div>
    </div>
  );
}

export default ResultPanel;
