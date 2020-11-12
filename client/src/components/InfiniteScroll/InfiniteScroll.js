import React, { useRef, useState } from 'react';

import { AutoSizer, List } from 'react-virtualized';
import { Scrollbars } from 'react-custom-scrollbars';
import { MessageSharp } from '@material-ui/icons';

const THRESHOLD = 15;

const SCROLL_DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
};

export const InfiniteScroll = ({ fetchMore, items, renderRow }) => {
  const listRef = useRef();
  // const scrollbarRef = useRef();

  const [lastScrollTop, setLastScrollTop] = useState();
  const [scrollDirection, setScrollDirection] = useState();

  // const scrollbarRefSetter = (ref) => {
  //   scrollbarRef.current = ref;

  //   if (ref && !scrolledToBottom) {
  //     ref.scrollToBottom();
  //     setScrolledToBottom(true);
  //   }
  // };

  // const handleScrollbarScroll = ({ target: { scrollTop, scrollLeft } }) => {
  //   listRef.current.Grid.handleScrollEvent({ scrollTop, scrollLeft });
  // };

  const handleListScroll = ({ scrollTop }) => {
    if (lastScrollTop) {
      if (scrollTop < lastScrollTop) {
        setScrollDirection(SCROLL_DIRECTIONS.UP);
      } else if (scrollTop > lastScrollTop) {
        setScrollDirection(SCROLL_DIRECTIONS.DOWN);
      }
    }

    setLastScrollTop(scrollTop);
  };

  // const handleUpdate = ({ scrollTop }) => {
  //   if (scrollTop < 1 && scrollbarRef.current) {
  //     scrollbarRef.current.scrollTop(scrollTop + 1);
  //   }
  // };

  const handleRowsRendered = ({ startIndex, stopIndex }) => {
    // if (scrolledToBottom) {
    if (startIndex <= THRESHOLD && scrollDirection === SCROLL_DIRECTIONS.UP) {
      fetchMore({ direction: SCROLL_DIRECTIONS.UP });
    } else if (
      stopIndex >= items.length - THRESHOLD &&
      scrollDirection === SCROLL_DIRECTIONS.DOWN
    ) {
      fetchMore({ direction: SCROLL_DIRECTIONS.DOWN });
    }
    // }
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        // <Scrollbars
        //   autoHide={true}
        //   autoHideTimeout={500}
        //   style={{ height, width }}
        //   ref={scrollbarRefSetter}
        //   onScroll={handleScrollbarScroll}
        //   onUpdate={handleUpdate}
        // >
        <List
          height={height}
          width={width}
          rowHeight={75}
          rowRenderer={renderRow}
          rowCount={items.length}
          onRowsRendered={handleRowsRendered}
          onScroll={handleListScroll}
          scrollToIndex={items.length - 1}
          // style={{ overflowX: 'visible', overflowY: 'visible' }}
          ref={listRef}
        />
        // </Scrollbars>
      )}
    </AutoSizer>
  );
};
