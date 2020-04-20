import { remove, load } from 'react-cookies';
import { getCookieOptions } from './domain';

const circleKey = 'x-circle-id';

export const getCircleId = () => load(circleKey);

export const clearCircleId = () => remove(circleKey, getCookieOptions());
