import React from 'react';
import { render, wait, fireEvent } from 'unit-test/testUtils';
import CardExpand from '../';

test('render CardExpand with children', async () => {
  const onclick = jest.fn();
  const { getByText } = render(
    <CardExpand
      items={[
        { id: '1', artifact: 'artifact', version: 'v1', componentName: 'ui', moduleName: 'charles' }
      ]}
      onClick={onclick}
    />
  );

  await wait(() => expect(getByText('charles/ui/v1')).toBeInTheDocument());
});

test('click outside CardExpand', async () => {
  const onclick = jest.fn();
  const { getByTestId } = render(
    <div data-testid="wrapper-card-expand">
      <CardExpand
        items={[
          { id: '1', artifact: 'artifact', version: 'v1', componentName: 'ui', moduleName: 'charles' }
        ]}
        onClick={onclick}
      />
    </div>
  );

  const CardWrapper = getByTestId('wrapper-card-expand');
  fireEvent.click(CardWrapper);

  await wait(() => expect(onclick).toHaveBeenCalled());
});