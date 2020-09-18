import styled from '@emotion/styled';

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const LoaderMessage = styled.div`
  font-size: 8px;
  font-family: 'Press Start 2P', mono;
  margin-top: 20px;
`;
