import THEME from 'core/assets/themes';
import get from 'lodash/get';

export const getTheme = () => {
  const type = localStorage.getItem('theme');

  return get(THEME, type, THEME.dark);
};
