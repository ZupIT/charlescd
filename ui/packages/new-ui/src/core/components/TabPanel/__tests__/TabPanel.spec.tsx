import React from 'react';
import { render, fireEvent, wait } from 'unit-test/testUtils';
import TabPanel from '../';


test('render TabPanel default component loading mode', async () => {
  const Children = <div>children</div>;

  const { getByText, queryByTestId } = render(
    <TabPanel title="Circle" children={Children} name="charles" />
  );

  await wait(() => expect(getByText('Circle')).toBeInTheDocument());
  expect(getByText('children')).toBeInTheDocument();
  expect(queryByTestId('button')).not.toBeInTheDocument();
});

test('render TabPanel default component with action', async () => {
  const action = jest.fn();
  const Children = <div>children</div>;

  const { getAllByText, queryByTestId } = render(
    <TabPanel title="Circle" name="charles" size="15px" children={Children} onClose={action} />
  );

  const tabpanelBtnClose = queryByTestId('button-icon-cancel');

  await wait(() => expect(tabpanelBtnClose).toBeInTheDocument());
  fireEvent.click(tabpanelBtnClose);
  expect(action).toBeCalled();
});
