import styled from '@emotion/styled';

import { List, ListItem } from '@material-ui/core';

import { ReactComponent as PoundSign } from '@dissonance/assets/images/pound-sign.svg';

export const ChannelListContainer = styled.div`
  height: 100%;
  width: 240px;
  background-color: ${({ theme }) => theme.palette.background.secondary};
`;

export const ChannelListChannels = styled(List)`
  padding: 10px;
`;

export const ChannelListChannel = styled(ListItem)`
  height: 32px;
  padding: 0 8px;
  margin-top: 2px;
  margin-bottom: 2px;
  border-radius: 4px;
  color: ${({ selected }) => (selected ? '#ffffff' : '#72767d')};

  &:hover {
    color: #ffffff;
  }
`;

export const ChannelListChannelText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChannelListChannelPoundSign = styled(PoundSign)`
  padding-right: 5px;
`;

export const ChannelListChannelName = styled.div`
  font-weight: 500;
`;

export const ChannelListTopBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);
`;
