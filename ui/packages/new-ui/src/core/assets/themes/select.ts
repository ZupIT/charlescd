import {
  COLOR_LIGHT_DEFAULT,
  COLOR_BLACK_RUSSIAN,
  COLOR_NEON_BLUE,
  COLOR_BASTILLE,
  COLOR_WHITE,
  COLOR_BLACK_MARLIN,
  COLOR_SANTAS_GREY
} from '../colors';

export const light = {};

export const dark = {
  background: COLOR_BLACK_RUSSIAN,
  color: COLOR_LIGHT_DEFAULT,
  placeholder: COLOR_SANTAS_GREY,
  borderColor: COLOR_WHITE,
  disabled: {
    color: COLOR_SANTAS_GREY,
    borderColor: COLOR_SANTAS_GREY
  },
  focus: {
    color: COLOR_LIGHT_DEFAULT,
    borderColor: COLOR_NEON_BLUE
  },
  menu: {
    background: COLOR_BASTILLE,
    color: COLOR_LIGHT_DEFAULT,
    border: COLOR_BASTILLE,
    hover: {
      background: COLOR_BLACK_MARLIN
    }
  }
};
