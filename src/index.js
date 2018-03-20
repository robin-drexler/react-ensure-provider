import React from 'react';
import createContext from './createContext';

export const createContextFactory = (createContextFn) => {
  return (message, overrideCreateContextFn = createContextFn) => {
    return createContext(message, overrideCreateContextFn);
  };
};

export default (...args) => createContext(...args);
