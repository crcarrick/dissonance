import styled from '@emotion/styled';
import { Avatar, Badge } from '@material-ui/core';
import { ImageOutlined } from '@material-ui/icons';

const size = `
  width: 100px;
  height: 100px;
`;

export const ImageUploaderAvatar = styled(Avatar)`
  ${size}
  font-size: 36px;
  font-weight: 300;
  ${({ theme }) => `
    background-color: ${theme.palette.primary.main};
    box-shadow: ${theme.shadows[4]};
    color: ${theme.palette.getContrastText(theme.palette.primary.main)};
  `}
`;

export const ImageUploaderBadge = styled(Badge)``;

export const ImageUploaderContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

export const ImageUploaderIcon = styled(ImageOutlined)`
  font-size: 18px;
  fill: ${({ theme }) => theme.palette.background.paper};
`;

export const ImageUploaderIconContainer = styled(Avatar)`
  width: 28px;
  height: 28px;
  background-color: #dcddde;
  box-shadow: ${({ theme }) => theme.shadows[2]};
`;

export const ImageUploaderInput = styled.input`
  display: none;
`;

export const ImageUploaderOverlay = styled.div`
  ${size}
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  text-transform: uppercase;
  opacity: ${({ hovering }) => (hovering ? 1 : 0)};
  transition: opacity 100ms ease-in;
`;
