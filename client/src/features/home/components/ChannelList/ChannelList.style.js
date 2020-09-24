import styled from '@emotion/styled';

import { List, ListItem, ListItemText } from '@material-ui/core';

export const ChannelListContainer = styled.div`
  height: 100%;
  width: 240px;
  padding: 5px;
  background-color: ${({ theme }) => theme.palette.background.secondary};
`;

export const ChannelListServerName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50px;
`;

export const ChannelListChannels = styled(List)``;

export const ChannelListChannel = styled(ListItem)``;

export const ChannelListChannelText = styled(ListItemText)``;
