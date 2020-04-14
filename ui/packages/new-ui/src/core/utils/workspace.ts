import { load, remove } from 'react-cookies';
import { getCookieOptions } from './domain';

const applicationKey = 'application';

export const getApplicationId = () => load(applicationKey);

export const clearApplication = () =>
  remove(applicationKey, getCookieOptions());
