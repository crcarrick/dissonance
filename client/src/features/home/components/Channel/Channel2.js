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
          fetchMore={loading ? () => {} : fetchMore}
          items={messages}
          renderRow={({ key, index, style }) => {
            const { author, text, createdAt } = messages[index];

            return (
              <ChannelMessage key={key} style={{ ...style }}>
                <ChannelMessageAvatar src={author.avatarUrl} />
                <ChannelMessageContent style={{ marginLeft: 16 }}>
                  <ChannelMessageUsername>
                    {author.username}
                    <span
                      style={{
                        color: '#72767d',
                        fontSize: 12,
                        marginLeft: 10,
                      }}
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
