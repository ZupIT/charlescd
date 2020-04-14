import * as metricHelpers from '../helpers';

test('toList | convert data to chart series', () => {
  const expected = [[1583692711113, 30], [1583692712113, 25]];
  const data = [
    { value: 30, timestamp: 1583692711113 },
    { value: 25, timestamp: 1583692712113 }
  ];

  expect(metricHelpers.toList(data)).toMatchObject(expected);
});
