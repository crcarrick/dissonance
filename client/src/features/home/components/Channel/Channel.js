import React from 'react';

import { useChannel } from './Channel.hooks';

export const Channel = () => {
  const { channel } = useChannel();

  return <div>{channel.name}</div>;
};
