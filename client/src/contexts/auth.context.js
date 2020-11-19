import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
});

export const AuthContextProvider = AuthContext.Provider;
