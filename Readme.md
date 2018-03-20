# react-ensure-provider

Throw an error when `Context.Consumer` is rendered outside `Context.Provider`.

The [new react context API](https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md) allows to pass data and functions multiple levels deep, encouraging the use of render props.

```js
import React from 'react';

const defaultValue = 'foo'; // some default value
const Context = React.createContext(defaultValue);
```

`defaultValue` is used whenever a `Context.Consumer` is rendered outside of the respective `Context.Provider`. Otherwise the prop passed to `value` (or null when omitted) is used.

This fine when there are sensible default values, for example if you create a ThemeProvider.

However, projects, such as [redux](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store) use context to pass objects (or functions) that need to be configured and passed in by the user first and therefore can not have a default value.

While one could provide a higher order component to do the check and throw an error. However, the new context api encourages the (in many cases) simpler render prop pattern.

`react-ensure-provider` can help with that. It can be instead of `React.createContext`. The only difference is that the first argument is the error message that is thrown instead of a default value.

```js
import { createContext } from 'react-ensure-provider';
const Context = createContext(
  'Can not find store. Did you forget to wrap the context in a provider?'
);
```

If you are using React <16.3.0, you can pass in a function that will be used to create the context instead of `React.createContext`. I recommend [create-react-context](https://github.com/jamiebuilds/create-react-context).

```js
import createReactContext from 'create-react-context';
import { createContext } from 'react-ensure-provider';

const Context = createContext('BROKEN', createReactContext);
```

You can find an [example here](https://codesandbox.io/s/5486p929op).

It's also possible to create a `createContext` function with your `React.createContext` override function baked in. So you do not need to do it all the time.

```js
import { createContextFactory } from 'react-ensure-provider';
import createReactContext from 'create-react-context';

export default createContextFactory(createReactContext);
```
