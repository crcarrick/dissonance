import React, { useRef } from 'react';

import { formatRelative } from 'date-fns';
import { upperFirst } from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import { Waypoint } from 'react-waypoint';

import { useChannel } from './Channel.hooks';
import {
  ChannelContainer,
  ChannelInput,
  ChannelInputContainer,
  ChannelMessage,
  ChannelMessageAvatar,
  ChannelMessageContent,
  ChannelMessages,
  ChannelMessageText,
  ChannelMessageUsername,
  ChannelName,
  ChannelPoundSign,
  ChannelTopBar,
} from './Channel.style';

export const Channel = () => {
  const scrollbarRef = useRef();

  const {
    loading,
    edges,
    pageInfo,
    channel,
    fetchMore,
    handleChange,
    handleSubmit,
    message,
  } = useChannel(scrollbarRef);

  return (
    <ChannelContainer>
      <ChannelTopBar>
        <ChannelPoundSign />
        <ChannelName>{channel?.name}</ChannelName>
      </ChannelTopBar>
      <Scrollbars
        autoHeightMax={'100vh'}
        autoHide={true}
        autoHideTimeout={500}
        style={{ flex: 1 }}
        ref={(ref) => {
          scrollbarRef.current = ref;
          if (ref && edges?.length === 50) {
            ref.scrollToBottom();
          }
        }}
        onUpdate={({ scrollTop }) => {
          if (scrollTop < 1 && scrollbarRef.current) {
            scrollbarRef.current.scrollTop(scrollTop + 1);
          }
        }}
      >
        <ChannelMessages>
          {edges.map(({ node: { id, author, text, createdAt } }, i) => (
            <ChannelMessage key={id}>
              {i === 25 && (
                <Waypoint
                  onEnter={() => {
                    if (!loading && pageInfo.hasPreviousPage) {
                      fetchMore({ direction: 'up' });
                    }
                  }}
                />
              )}
              {/* {edges.length === 200 && i === 175 && (
                <Waypoint
                  onEnter={() => {
                    if (!loading && pageInfo.hasNextPage) {
                      fetchMore({ direction: 'down' });
                    }
                  }}
                />
              )} */}
              <ChannelMessageAvatar
                src={author.avatarUrl}
                style={{
                  background:
                    i === 25
                      ? 'red'
                      : edges.length === 200 && i === 175
                      ? 'green'
                      : 'white',
                }}
              />
              <ChannelMessageContent style={{ marginLeft: 16 }}>
                <ChannelMessageUsername>
                  {author.username}
                  <span
                    style={{ color: '#72767d', fontSize: 12, marginLeft: 10 }}
                  >
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
        </ChannelMessages>
      </Scrollbars>
      <ChannelInputContainer onSubmit={handleSubmit}>
        <ChannelInput
          placeholder={`Message #${channel?.name}`}
          onChange={handleChange}
          value={message}
        />
      </ChannelInputContainer>
    </ChannelContainer>
  );
};
