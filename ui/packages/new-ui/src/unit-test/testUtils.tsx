import React, { ReactElement, ReactNode, useReducer } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'styled-components';
import { Provider as ContextProvider } from 'core/state/store';
import THEME from 'core/assets/themes';
import { rootReducer, rootState } from 'core/state';

import './apexcharts.mock';
import './icon.mock';

interface RenderOptions {
  initialEntries: string[];
}

interface Props extends RenderOptions {
  children: ReactNode;
}

const initialOptions: RenderOptions = {
  initialEntries: ['']
};

export const AllTheProviders: React.FC<any> = ({
  children,
  initialEntries
}: Props) => {
  const globalState = useReducer(rootReducer, rootState);

  return (
    <ContextProvider value={globalState}>
      <ThemeProvider theme={THEME.dark}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </ThemeProvider>
    </ContextProvider>
  );
};

export const ThemeProviderWrapper: React.FC<any> = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={THEME.dark}>
      {children}
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options = initialOptions) =>
  render(ui, {
    wrapper: AllTheProviders,
    ...options
  });

const customRenderWithTheme = (ui: ReactElement, options?: any) =>
  render(ui, { wrapper: ThemeProviderWrapper, ...options });

export * from '@testing-library/react';

export { customRender as render };
export { customRenderWithTheme as renderWithTheme };
