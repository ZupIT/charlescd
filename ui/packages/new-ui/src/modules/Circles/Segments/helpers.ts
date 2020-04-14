import options from './conditional.options';

export const getCondition = (condition: string) => {
  return options.find(({ value }) => condition === value);
};
