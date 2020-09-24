import React from 'react';

import {
  ImageUploaderAvatar,
  ImageUploaderBadge,
  ImageUploaderContainer,
  ImageUploaderIcon,
  ImageUploaderIconContainer,
  ImageUploaderInput,
  ImageUploaderOverlay,
} from './ImageUploader.style';
import { useImageUploader } from './ImageUploader.hooks';

export const ImageUploader = ({ imageUrl }) => {
  const { containerProps, inputProps, bgImage, hovering } = useImageUploader({
    imageUrl,
  });

  return (
    <ImageUploaderContainer {...containerProps}>
      <ImageUploaderBadge
        overlap="circle"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        badgeContent={
          <ImageUploaderIconContainer>
            <ImageUploaderIcon />
          </ImageUploaderIconContainer>
        }
      >
        <ImageUploaderAvatar src={bgImage}>Ts</ImageUploaderAvatar>
      </ImageUploaderBadge>
      <ImageUploaderOverlay hovering={hovering}>
        change
        <br />
        avatar
      </ImageUploaderOverlay>
      <ImageUploaderInput {...inputProps} />
    </ImageUploaderContainer>
  );
};
