import { merge } from 'lodash';

export const mergeConfigs = (config) => {
  return {
    typeDefs: config.typeDefs.join(' '),
    resolvers: merge({}, ...config.resolvers),
    ...config,
  };
};
