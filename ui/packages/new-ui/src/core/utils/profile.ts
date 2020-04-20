import { load, remove } from 'react-cookies';
import { getCookieOptions } from './domain';

const profileKey = 'profile';

export const getProfile = () => {
  try {
    const profile = load(profileKey);
    return JSON.parse(atob(profile));
  } catch (e) {
    return {};
  }
};

export const getProfileByKey = (key: string) => {
  const profile = getProfile();

  return profile[key];
};

export const clearProfile = () => remove(profileKey, getCookieOptions());
