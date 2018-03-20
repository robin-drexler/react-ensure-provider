import React from 'react';

export default (message = '', createContextFn = React.createContext) => {
  // xxx use object and compare based on identity
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
