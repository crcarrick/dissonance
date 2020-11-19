import React, { useRef, useState } from 'react';

import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from 'react-virtualized';

import { Virtuoso } from 'react-virtuoso';

const CELL_CACHE = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 75,
});

const DIRECTION = {
  Up: 'up',
  Down: 'down',
};

export const InfiniteScroll = ({
  fetchMore,
  items,
  renderRow,
  threshold = 15,
}) => {
  const listRef = useRef();

  const [prevScrollTop, setPrevScrollTop] = useState(0);
  const [scrollDirection, setScrollDirection] = useState();
  const [scrollToIndex, setScrollToIndex] = useState(items.length - 1);

  const rowRenderer = ({ key, index, isVisible, parent, style }) => {
    if (isVisible) {
      return (
        <CellMeasurer
          key={key}
          cache={CELL_CACHE}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {({ registerChild }) => renderRow({ index, registerChild, style })}
        </CellMeasurer>
      );
    }
  };

  const handleScroll = ({ scrollTop }) => {
    if (scrollTop < prevScrollTop) {
      setScrollDirection(DIRECTION.Up);
    } else if (scrollTop > prevScrollTop) {
      setScrollDirection(DIRECTION.Down);
    }
    setPrevScrollTop(scrollTop);
  };

  const handleRowsRendered = ({ startIndex, stopIndex }) => {
    if (
      (startIndex <= threshold && scrollDirection === DIRECTION.Up) ||
      (stopIndex >= threshold && scrollDirection === DIRECTION.Down)
    ) {
      fetchMore({ direction: scrollDirection });
    }
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          deferredMeasurementCache={CELL_CACHE}
          height={height}
          onRowsRendered={handleRowsRendered}
          onScroll={handleScroll}
          ref={listRef}
          rowCount={items.length}
          rowHeight={CELL_CACHE.rowHeight}
          rowRenderer={rowRenderer}
          scrollToIndex={scrollToIndex}
          width={width}
        />
      )}
    </AutoSizer>
  );
};
