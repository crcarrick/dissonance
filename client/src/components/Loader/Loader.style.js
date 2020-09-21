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
  font-family: 'Press Start 2P', mono;
  font-size: 13px;
  font-style: italic;
  margin-top: 20px;
`;

export const LoaderType = styled.div`
  font-size: 14px;
  color: #72767d;
  font-weight: bold;
`;
