import map from 'lodash/map';

export const counter = (array: unknown[], quantityLimit: number) => {
  let count = 0;
  map(array, (item, index) => {
    if (index > quantityLimit - 1) {
      count = count + 1;
    }
  });
  return count;
};
