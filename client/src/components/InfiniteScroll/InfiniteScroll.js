import React, { useRef } from 'react';

import { Virtuoso } from 'react-virtuoso';
import { Scrollbars } from 'react-custom-scrollbars';

// const DIRECTION = {
//   Up: 'up',
//   Down: 'down',
// };

const CustomScrollbar = ({ style, reportScrollTop, scrollTo, children }) => {
  const scrollbarRef = useRef();

  scrollTo((scrollTop) => scrollbarRef.current.scrollTop(scrollTop));

  return (
    <Scrollbars
      autoHide={true}
      autoHideTimeout={500}
      style={{ ...style }}
      onUpdate={({ scrollTop }) => {
        if (scrollTop < 1) {
          scrollbarRef.current.scrollTop(scrollTop + 1);
          reportScrollTop(scrollTop + 1);
        } else {
          scrollbarRef.current.scrollTop(scrollTop);
          reportScrollTop(scrollTop);
        }
      }}
      ref={scrollbarRef}
    >
      {children}
    </Scrollbars>
  );
};

export const InfiniteScroll = ({
  fetchMore,
  items,
  renderRow,
  threshold = 25,
}) => {
  const virtuosoRef = useRef();

  // const handleStartReached = () => {
  //   fetchMore({ direction: DIRECTION.Up }).then((length) =>
  //     virtuosoRef.current.adjustForPrependedItems(length)
  //   );
  // };

  // const handleEndReached = () => {
  //   fetchMore({ direction: DIRECTION.Down });
  // };

  const item = (index) => {
    if (items[index]) {
      return renderRow({ index });
    }
  };

  return (
    <Virtuoso
      style={{ width: '100%', height: '100%' }}
      overscan={1000}
      totalCount={items.length}
      item={item}
      ref={virtuosoRef}
      ScrollContainer={CustomScrollbar}
    />
  );
};
