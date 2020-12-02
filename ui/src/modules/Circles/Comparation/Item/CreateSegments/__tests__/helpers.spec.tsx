import { DEPLOYMENT_STATUS } from 'core/enums/DeploymentStatus';
import { Deployment } from 'modules/Circles/interfaces/Circle';
import React from 'react'
import { editingPercentageLimit, getWarningText, validatePercentage } from '../helpers';
import { deployment } from './fixtures';


test('Editing Percentage Limit with just limitPercentage', async () => {

    const limit = editingPercentageLimit(30, null, 15)

    expect(limit).toBe(30)

});

test('Editing Percentage Limit with valid deployment', async () => {

    const limit = editingPercentageLimit(30, deployment, 15)

    expect(limit).toBe(45)

});

test('Editing Percentage Limit open sea without availability.', async () => {

    const limit = editingPercentageLimit(0, deployment, 15)

    expect(limit).toBe(15)
});

test('getWarningText with CSV_TO_MANUAL', async () => {
    expect(getWarningText("CSV_TO_MANUAL")).toBe('Your current base was imported using a .CSV file, manually creating your entire circle segmentation will be deleted and replaced.')
})

test('test getWarning text when MANUAL_TO_CSV', async () => {
    expect(getWarningText('MANUAL_TO_CSV')).toBe('Your current segmentation was created using manual rules, this rules will be replaced by the CSV content.')
})

test('test getWarning text when PERCENTAGE_TO_MANUA', async () => {
    expect(getWarningText('PERCENTAGE_TO_MANUAL')).toBe('Your current percentage circle will be converted to segmentation circle.')
})

test('test getWarning text when PERCENTAGE_TO_CSV', async () => {
    expect(getWarningText('PERCENTAGE_TO_CSV')).toBe('Your current percentage circle will be converted to segmentation circle.')
})

test('test getWarning text when MANUAL_TO_PERCENTAGE', async () => {
    expect(getWarningText('MANUAL_TO_PERCENTAGE')).toBe('Your current segmentation will be deleted and replaced with percentage rules.')
})

test('test getWarning text when CSV_TO_PERCENTAGE', async () => {
    expect(getWarningText('CSV_TO_PERCENTAGE')).toBe('Your current segmentation will be deleted and replaced with percentage rules.')
})

test('test getWarning text when IMPORT_CSV', async () => {
    expect(getWarningText('IMPORT_CSV')).toBe('When you import another .CSV your entire circle segmentation will be deleted and replaced by the new one.')
})

test('test validatePercentage should return message', async () => {
    const errorMessage = validatePercentage(5, 3)
    expect(errorMessage).toBe('Percentage should be lower than 3.')
})

test('test validatePercentage should not return message if value is Equal or lower then limitValue', async () => {
    const errorMessageEqual = validatePercentage(3, 3)
    expect(errorMessageEqual).toBeFalsy()

    const errorMessageLower = validatePercentage(1, 3)
    expect(errorMessageLower).toBeFalsy()
})