import React, { ReactElement } from 'react';
import { render, screen, waitFor, act } from 'unit-test/testUtils';
import AvailablePercentage from '../AvailablePercentage';
import { CirclePercentagePagination } from 'modules/Circles/interfaces/CirclesPagination';
import { Author, Circle } from 'modules/Circles/interfaces/Circle';
import { circle, mockPercentageCircles } from '../../CreateSegments/__tests__/fixtures';


test('render AvailablePercentage default component', async () => {
  
    render(
      <AvailablePercentage responseGetCircles={mockPercentageCircles} />
    );
  
    const availableItem = await screen.findByTestId('available-percentage-open-sea')
  
    expect(availableItem).toBeInTheDocument();
  });

test('render AvailablePercentage with circle (Editing case)', async () => {
  
    render(
      <AvailablePercentage responseGetCircles={mockPercentageCircles} circle={circle} />
    );
  
    const availableItem = await screen.findByTestId('available-percentage-open-sea')
    const circleItem = await screen.findByTestId('configured-circle-percentage')
    const circlePercentageValue = await screen.findByTestId('configured-circle-percentage-value')

  
    expect(availableItem).toBeInTheDocument();
    expect(circleItem).toBeInTheDocument();
    expect(circlePercentageValue.textContent).toBe("10%");
  });


test('AvailablePercentage should calculate open sea percentage properly', async () => {
  
    render(
      <AvailablePercentage responseGetCircles={mockPercentageCircles} circle={circle} />
    );
  
    const availableItem = await screen.findByTestId("available-percentage-open-sea-value")
  
    expect(availableItem.textContent).toBe("90%")
  });
