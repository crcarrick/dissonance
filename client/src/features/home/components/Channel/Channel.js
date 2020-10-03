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
    channel,
    messages,
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
        ref={scrollbarRef}
      >
        <ChannelMessages>
          <Waypoint onEnter={() => fetchMore()} />
          {messages?.map(({ id, author, text, createdAt }) => (
            <ChannelMessage key={id}>
              <ChannelMessageAvatar src={author.avatarUrl} />
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
