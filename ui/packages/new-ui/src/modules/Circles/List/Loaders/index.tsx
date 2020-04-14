import React from 'react';
import { Loader as LoaderHeader } from './header';
import { Loader as LoaderContent } from './content';

const Loader = {
  Content: () => <LoaderContent />,
  Header: () => <LoaderHeader />
};

export default Loader;
