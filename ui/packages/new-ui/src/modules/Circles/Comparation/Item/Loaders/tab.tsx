import React, { FunctionComponent } from 'react';
import TabPanel from 'core/components/TabPanel';
import ContentLoader from 'react-content-loader';

export const Loader: FunctionComponent = () => (
  <TabPanel title="Loading..." name="charles" size="15px">
    <ContentLoader
      speed={4}
      width={660}
      height={700}
      viewBox="0 0 660 700"
      backgroundColor="#3a393c"
      foregroundColor="#2c2b2e"
    >
      <rect x="0" y="35" rx="22" ry="22" width="22" height="22" />
      <rect x="35" y="35" rx="4" ry="4" width="300" height="22" />
      <rect x="0" y="100" rx="22" ry="22" width="22" height="22" />
      <rect x="35" y="100" rx="4" ry="4" width="300" height="22" />
      <rect x="35" y="150" rx="4" ry="4" width="80" height="22" />
      <rect x="135" y="150" rx="4" ry="4" width="80" height="22" />
      <rect x="235" y="150" rx="4" ry="4" width="80" height="22" />
      <rect x="35" y="190" rx="4" ry="4" width="80" height="22" />
      <rect x="135" y="190" rx="4" ry="4" width="80" height="22" />
      <rect x="235" y="190" rx="4" ry="4" width="80" height="22" />
      <rect x="35" y="230" rx="4" ry="4" width="80" height="22" />
      <rect x="135" y="230" rx="4" ry="4" width="80" height="22" />
      <rect x="235" y="230" rx="4" ry="4" width="80" height="22" />
      <rect x="0" y="280" rx="22" ry="22" width="22" height="22" />
      <rect x="35" y="280" rx="4" ry="4" width="300" height="22" />
      <rect x="35" y="330" rx="4" ry="4" width="269" height="60" />
      <rect x="0" y="425" rx="22" ry="22" width="22" height="22" />
      <rect x="35" y="425" rx="4" ry="4" width="300" height="22" />
    </ContentLoader>
  </TabPanel>
);
