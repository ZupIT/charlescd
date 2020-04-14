import React, { FunctionComponent } from 'react';
import ContentLoader from 'react-content-loader';

export const Loader: FunctionComponent = () => (
  <ContentLoader
    speed={4}
    width={200}
    height={200}
    viewBox="0 0 200 200"
    backgroundColor="#3a393c"
    foregroundColor="#2c2b2e"
  >
    <rect x="0" y="0" rx="4" ry="4" width="260" height="15" />
    <rect x="0" y="35" rx="4" ry="4" width="260" height="15" />
    <rect x="0" y="70" rx="4" ry="4" width="260" height="15" />
  </ContentLoader>
);
