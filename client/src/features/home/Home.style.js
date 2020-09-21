import styled from '@emotion/styled';
import { Box } from '@material-ui/core';

const flexCenter = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const HomeContainer = styled(Box)`
  ${flexCenter}
  flex-direction: row;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.paper};
`;
