export const baseOptions = [
  { value: 'GREATER_THAN', label: 'Higher than' },
  { value: 'LOWER_THAN', label: 'Lower than' }
];

export const conditionOptions = [
  { value: 'EQUAL', label: 'Equal' },
  ...baseOptions
];

export const operatorsOptions = [
  { value: '=', label: 'Equal' },
  ...baseOptions
];

export const FILTER = {
  field: '',
  condition: '',
  value: ''
};

export const defaultFilterValues = [FILTER];
