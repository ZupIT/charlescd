export const thresholdOptions = [
  { value: 'EQUAL', label: 'Equal' },
  { value: 'GREATER_THAN', label: 'Higher than' },
  { value: 'LOWER_THAN', label: 'Lower than' }
];

export const FILTER = {
  field: '',
  condition: '',
  value: ''
};

export const defaultFilterValues = {
  filters: [FILTER]
};
