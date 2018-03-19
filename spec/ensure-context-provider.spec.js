import React from 'react';
import { render } from 'react-testing-library';

import * as createReactContext from 'create-react-context';

import createContext, { resetProviderCounter } from '../';

describe('ensure context provider', () => {
  beforeEach(() => {
    global.console.error = jest.fn();
  });

  afterEach(() => {
    global.console.error.mockRestore();
  });

  it('throws error when Provider is not rendered', () => {
    const Context = createContext('missing provider');

    expect(() => {
      render(
        <div>
          <Context.Consumer>{() => {}}</Context.Consumer>
        </div>
      );
    }).toThrow('missing provider');
  });

  it('renders and passes value when Provider is rendered', () => {
    const Context = createContext('missing provider');

    const { container } = render(
      <div>
        <Context.Provider value="first">
          <Context.Consumer>{(value) => <span>{value}</span>}</Context.Consumer>
        </Context.Provider>
      </div>
    );

    expect(container.querySelector('span').textContent).toEqual('first');
  });

  it('throws error when nesting does not match', () => {
    const Context = createContext('first-error');
    const SecondContext = createContext('second-error');

    expect(() => {
      render(
        <div>
          <Context.Provider value="first">
            <Context.Consumer>
              {(value) => (
                <SecondContext.Consumer>{() => {}}</SecondContext.Consumer>
              )}
            </Context.Consumer>
          </Context.Provider>
        </div>
      );
    }).toThrow('second-error');
  });

  it('renders and passes value with multiple Providers', () => {
    const Context = createContext('first-error');
    const SecondContext = createContext('second-error');

    const { container } = render(
      <div>
        <Context.Provider value="first">
          <Context.Consumer>{(value) => <span>{value}</span>}</Context.Consumer>
        </Context.Provider>
        <Context.Provider value="second">
          <Context.Consumer>{(value) => <span>{value}</span>}</Context.Consumer>
        </Context.Provider>
      </div>
    );

    expect(container.querySelectorAll('span')[0].textContent).toEqual('first');
    expect(container.querySelectorAll('span')[1].textContent).toEqual('second');
  });

  it('renders and passes value with nested Providers', () => {
    const Context = createContext('first-error');
    const SecondContext = createContext('second-error');

    const { container } = render(
      <div>
        <Context.Provider value="first">
          <Context.Consumer>
            {(value) => (
              <div>
                <span>{value}</span>
                <SecondContext.Provider value="second">
                  <SecondContext.Consumer>
                    {(value) => <span>{value}</span>}
                  </SecondContext.Consumer>
                </SecondContext.Provider>
              </div>
            )}
          </Context.Consumer>
        </Context.Provider>
      </div>
    );

    expect(container.querySelectorAll('span')[0].textContent).toEqual('first');
    expect(container.querySelectorAll('span')[1].textContent).toEqual('second');
  });

  it('allows to override createContext function', () => {
    const spy = jest.spyOn(createReactContext, 'default');
    const Context = createContext('first-error', createReactContext.default);

    const { container } = render(
      <div>
        <Context.Provider value="first">
          <Context.Consumer>{(value) => <span>{value}</span>}</Context.Consumer>
        </Context.Provider>
      </div>
    );

    expect(spy).toHaveBeenCalled();
    expect(container.querySelectorAll('span')[0].textContent).toEqual('first');
  });

  it('increases and resets keys', () => {
    resetProviderCounter();
    createContext('', (key) => {
      expect(key).toMatch(/_0$/);
      return { Provider: {} };
    });

    createContext('', (key) => {
      expect(key).toMatch(/_1$/);
      return { Provider: {} };
    });

    resetProviderCounter();

    createContext('', (key) => {
      expect(key).toMatch(/_0$/);
      return { Provider: {} };
    });
  });
});
