import React from 'react';

export const createContext = (
  message = '',
  createContextFn = React.createContext
) => {
  // key is later compared by identity
  const key = {};
  const Context = createContextFn(key);

  const Consumer = (props) => {
    return (
      <Context.Consumer>
        {(args) => {
          if (args === key) {
            throw new Error(message);
          }
          return props.children(args);
        }}
      </Context.Consumer>
    );
  };

  return {
    Provider: Context.Provider,
    Consumer: Consumer
  };
};

export const createContextFactory = (createContextFn) => {
  return (message, overrideCreateContextFn = createContextFn) => {
    return createContext(message, overrideCreateContextFn);
  };
};
