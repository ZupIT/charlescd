import userEvent from '@testing-library/user-event';
import React from 'react'
import { act } from 'react-dom/test-utils';
import { FormContextMock } from 'unit-test/form-context.mock';
import {fireEvent, render, screen, waitFor,  } from 'unit-test/testUtils';
import SliderPercentage from '../Slider';



test('render Percentage default component', async () => {

    render(
        <FormContextMock>
            <SliderPercentage
                limitValue={50}
            />
        </FormContextMock>
    );

    const sliderlimit = screen.getByTestId("slider-limit-value")

    expect(sliderlimit).toBeInTheDocument();
});


test('Change slider should change input', async () => {

    render(
        <FormContextMock>
            <SliderPercentage
                limitValue={50}
            />
        </FormContextMock>
    );

    const sliderInput = await screen.findByTestId("slider-input")
    const formInput = await screen.findByTestId("input-number-slider") as HTMLInputElement

    act(() => {
        userEvent.type(sliderInput, "45")
    })

    waitFor(() => {
        expect(formInput.value).toBe("45");
    })
});