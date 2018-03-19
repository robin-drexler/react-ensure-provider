import React from 'react';

let count = 0;

export const resetProviderCounter = () => {
  count = 0;
};

export default (message = '', createContextFn = React.createContext) => {
  const key = `__ENSURE_PROVIDER__${count++}`;
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
