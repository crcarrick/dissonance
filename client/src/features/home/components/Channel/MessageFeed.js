import React, { useRef } from 'react';

import { formatRelative } from 'date-fns';
import { upperFirst } from 'lodash';
import Skeleton from '@material-ui/lab/Skeleton';
import Infinite from 'react-infinite';
import { Scrollbars } from 'react-custom-scrollbars';

import {
  ChannelMessage,
  ChannelMessageAvatar,
  ChannelMessageContent,
  ChannelMessageUsername,
  ChannelMessageText,
} from './Channel.style';

export const MessageFeed = ({ fetchMore, loading, messages = [] }) => {
  const scrollbarRef = useRef();

  console.log(scrollbarRef.current);

  return (
    <Scrollbars
      autoHeightMax={'100vh'}
      autoHide={true}
      autoHideTimeout={500}
      style={{ flex: 1 }}
      ref={scrollbarRef}
    >
      {messages.map(({ id, createdAt, author, text }) => (
        <ChannelMessage key={id}>
          <ChannelMessageAvatar src={author.avatarUrl} />
          <ChannelMessageContent style={{ marginLeft: 16 }}>
            <ChannelMessageUsername>
              {author.username}
              <span style={{ color: '#72767d', fontSize: 12, marginLeft: 10 }}>
                {upperFirst(
                  formatRelative(new Date(createdAt), new Date()).replace(
                    'last ',
                    ''
                  )
                )}
              </span>
            </ChannelMessageUsername>
            <ChannelMessageText>{text}</ChannelMessageText>
          </ChannelMessageContent>
        </ChannelMessage>
      ))}
    </Scrollbars>
  );
};
