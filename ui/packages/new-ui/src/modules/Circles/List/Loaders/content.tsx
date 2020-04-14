import React, { FunctionComponent } from 'react';
import ContentLoader from 'react-content-loader';

export const Loader: FunctionComponent = () => (
  <ContentLoader
    speed={4}
    width={1600}
    height={800}
    viewBox="0 0 1600 800"
    backgroundColor="#3a393c"
    foregroundColor="#2c2b2e"
  >
    <rect x="0" y="18" rx="4" ry="4" width="303" height="800" />
    <rect x="330" y="18" rx="4" ry="4" width="303" height="352" />
    <rect x="660" y="18" rx="4" ry="4" width="303" height="352" />
    <rect x="330" y="400" rx="4" ry="4" width="303" height="352" />
    <rect x="660" y="400" rx="4" ry="4" width="303" height="352" />
  </ContentLoader>
);
