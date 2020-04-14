import React, { FunctionComponent } from 'react';
import ContentLoader from 'react-content-loader';

export const Loader: FunctionComponent = () => (
  <ContentLoader
    speed={4}
    width={363}
    height={45}
    viewBox="0 0 363 45"
    backgroundColor="#3a393c"
    foregroundColor="#2c2b2e"
  >
    <rect x="0" y="0" rx="4" ry="5" width="363" height="45" />
  </ContentLoader>
);
