import styled from '@emotion/styled';
import { Avatar } from '@material-ui/core';

import { ReactComponent as PoundSign } from '@dissonance/assets/images/pound-sign.svg';

export const ChannelContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
`;

export const ChannelTopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 48px;
  padding-left: 15px;
  box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);
`;

export const ChannelPoundSign = styled(PoundSign)``;

export const ChannelName = styled.div`
  margin-left: 10px;
  font-weight: 700;
  font-size: 16px;
`;

export const ChannelMessages = styled.div`
  flex: 1;
`;

export const ChannelMessage = styled.div`
  display: flex;
  padding: 16px;
`;

export const ChannelMessageAvatar = styled(Avatar)``;

export const ChannelMessageContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ChannelMessageUsername = styled.div``;

export const ChannelMessageText = styled.div``;

export const ChannelInputContainer = styled.form`
  display: flex;
  align-items: center;
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 24px;
  border-radius: 8px;
  background: #40444b;
  height: 44px;
  padding: 10px 16px;
  padding-left: 15px;
`;

export const ChannelInput = styled.input`
  background: transparent;
  border: none;
  color: rgb(220, 221, 222);
  font-size: 16px;

  &::placeholder {
    color: #72767d;
  }

  &:focus {
    outline: none;
  }
`;
