import React from 'react';

import { Loader } from '@dissonance/components';
import { useRouter } from '@dissonance/hooks';

import { ServerContainer } from './Server.style';
import { useServer } from './Server.hooks';

export const Server = () => {
  const { match } = useRouter();

  const { server } = useServer({ serverId: match.params.serverId });

  return <ServerContainer></ServerContainer>;
};
