import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import CirclePercentageList from '../CirclePercentageList';
import { circle, mockPercentageCircles } from '../../CreateSegments/__tests__/fixtures';
import userEvent from '@testing-library/user-event';


test('render CirclePercentageList default component', async () => {
  
    render(
      <CirclePercentageList responseGetCircles={mockPercentageCircles} />
    );
  
    const CirclePercentageListItem = await screen.findByTestId('circle-list-container')
  
    expect(CirclePercentageListItem).toBeInTheDocument();
  });


test('CirclePercentageList show list button', async () => {
  
    render(
      <CirclePercentageList responseGetCircles={mockPercentageCircles} />
    );
  
    const CirclePercentageListContainerButton = await screen.findByTestId('circle-list-container-button')
  
    userEvent.click(CirclePercentageListContainerButton)
    
    const CirclePercentageListItem = await screen.findByTestId(`circle-percentage-list-item-${circle.id}`)

    expect(CirclePercentageListContainerButton).toBeInTheDocument();
    expect(CirclePercentageListItem).toBeInTheDocument();

  });


