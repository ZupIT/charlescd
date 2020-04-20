import {
  COLOR_LIGHT_DEFAULT,
  COLOR_BLACK_RUSSIAN,
  COLOR_WHITE,
  COLOR_NEON_BLUE,
  COLOR_SANTAS_GREY
} from '../colors';

export const light = {};

export const dark = {
  background: COLOR_BLACK_RUSSIAN,
  color: COLOR_LIGHT_DEFAULT,
  label: COLOR_SANTAS_GREY,
  borderColor: COLOR_WHITE,
  disabled: {
    color: COLOR_SANTAS_GREY,
    borderColor: COLOR_SANTAS_GREY
  },
  focus: {
    borderColor: COLOR_NEON_BLUE
  },
  search: {
    color: COLOR_SANTAS_GREY,
    focus: {
      color: COLOR_LIGHT_DEFAULT
    }
  }
};
