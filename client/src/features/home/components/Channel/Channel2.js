import React from 'react';

import { formatRelative } from 'date-fns';
import { upperFirst } from 'lodash';

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
  ChannelMessageTimestamp,
  ChannelMessageUsername,
  ChannelName,
  ChannelPoundSign,
  ChannelTopBar,
} from './Channel.style';

import { InfiniteScroll } from '@dissonance/components';

export const Channel = () => {
  const {
    loading,
    channel,
    messages,
    fetchMore,
    handleChange,
    handleSubmit,
    message,
  } = useChannel();

  return (
    <ChannelContainer>
      <ChannelTopBar>
        <ChannelPoundSign />
        <ChannelName>{channel?.name}</ChannelName>
      </ChannelTopBar>
      <ChannelMessages>
        <InfiniteScroll
          fetchMore={
            loading
              ? () => Promise.resolve()
              : ({ direction }) =>
                  fetchMore({ direction }).then(
                    ({ data }) => data.messages.length
                  )
          }
          items={messages}
          renderRow={({ index }) => {
            const { author, text, createdAt } = messages[index];

            return (
              <ChannelMessage>
                <ChannelMessageAvatar src={author.avatarUrl} />
                <ChannelMessageContent style={{ marginLeft: 16 }}>
                  <ChannelMessageUsername>
                    {author.username}
                    <ChannelMessageTimestamp>
                      {upperFirst(
                        formatRelative(new Date(createdAt), new Date()).replace(
                          'last ',
                          ''
                        )
                      )}
                    </ChannelMessageTimestamp>
                  </ChannelMessageUsername>
                  <ChannelMessageText>{text}</ChannelMessageText>
                </ChannelMessageContent>
              </ChannelMessage>
            );
          }}
        />
      </ChannelMessages>
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
