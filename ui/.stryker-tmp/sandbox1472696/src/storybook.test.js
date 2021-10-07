// @ts-nocheck
import initStoryshots from '@storybook/addon-storyshots';
import 'jest-styled-components';
import { render } from 'unit-test/testUtils';

const reactTestingLibrarySerializer = {
  print: (val, serialize, indent) => serialize(val.container.firstChild),
  test: val => val && val.hasOwnProperty("container")
};

initStoryshots({
  renderer: render,
  snapshotSerializers: [reactTestingLibrarySerializer]
});