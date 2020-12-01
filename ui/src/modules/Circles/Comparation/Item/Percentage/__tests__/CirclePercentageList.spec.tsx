import React, { ReactElement } from 'react';
import { render, screen, fireEvent } from 'unit-test/testUtils';
import CirclePercentageList from '../CirclePercentageList';
import { CirclePercentagePagination } from 'modules/Circles/interfaces/CirclesPagination';
import { Author, Circle } from 'modules/Circles/interfaces/Circle';
import { circle, mockPercentageCircles } from '../../CreateSegments/__tests__/fixtures';


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
  
    fireEvent.click(CirclePercentageListContainerButton)
    
    const CirclePercentageListItem = await screen.findByTestId(`circle-percentage-list-item-${circle.id}`)

    expect(CirclePercentageListContainerButton).toBeInTheDocument();
    expect(CirclePercentageListItem).toBeInTheDocument();

  });


