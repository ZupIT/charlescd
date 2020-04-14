import THEME from 'core/assets/themes/index';
import { getTheme } from '../themes';

afterEach(() => {
  localStorage.removeItem('theme');
});

test('get theme default', () => {
  const theme = getTheme();

  expect(theme).toMatchObject(THEME.dark);
});

test('get theme from storage', () => {
  localStorage.setItem('theme', 'light');
  const theme = getTheme();

  expect(theme).toMatchObject(THEME.light);
});
