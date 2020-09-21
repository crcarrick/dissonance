import styled from '@emotion/styled';
import { Paper } from '@material-ui/core';

export const ServerListContainer = styled(Paper)``;

export const ServerListInnerContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 5px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export const ServerListIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 8px;
  cursor: pointer;
  transition: all 200ms ease-out;
  ${({ selected, theme }) => `
    background-color: ${
      selected ? theme.palette.primary.main : theme.palette.background.paper
    };
    border-radius: ${selected ? '15px' : '50%'};

    &:hover {
      background-color: ${theme.palette.primary.main};
      border-radius: 15px;
    }
  `}
`;
