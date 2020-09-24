import { useEffect, useRef, useState } from 'react';

import { useMutation } from '@apollo/client';
import axios from 'axios';

import { GET_ME } from '@dissonance/data';

import { CREATE_USER_AVATAR_SIGNED_URL } from './ImageUploader.gql';

const read = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};

export const useImageUploader = ({ imageUrl }) => {
  const inputRef = useRef();

  const [hovering, setHovering] = useState(false);
  const [bgImage, setBgImage] = useState(imageUrl);

  useEffect(() => imageUrl && setBgImage(imageUrl), [imageUrl]);

  const [createUserAvatarSignedUrl] = useMutation(
    CREATE_USER_AVATAR_SIGNED_URL,
    {
      refetchQueries: [{ query: GET_ME }],
    }
  );

  const handleChange = async (event) => {
    const [file] = event.target.files;

    try {
      const image = await read(file);

      setBgImage(image);

      const { data } = await createUserAvatarSignedUrl({
        variables: { input: { fileName: file.name } },
      });

      await axios.request({
        method: 'PUT',
        url: data.createAvatarSignedUrl.signedUrl,
        data: file,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = () => inputRef.current.click();

  return {
    containerProps: {
      onClick: handleClick,
      onMouseEnter: () => setHovering(true),
      onMouseLeave: () => setHovering(false),
    },

    inputProps: {
      accept: 'image/*',
      type: 'file',
      ref: inputRef,
      style: { display: 'none' },
      onChange: handleChange,
    },

    bgImage,
    hovering,
  };
};
