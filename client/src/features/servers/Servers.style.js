import styled from '@emotion/styled';
import { Box } from '@material-ui/core';

const flexCenter = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ServersContainer = styled(Box)`
  ${flexCenter}
  height: 100%;
  width: 100%;
`;
