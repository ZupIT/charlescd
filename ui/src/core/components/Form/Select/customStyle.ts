/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CSSProperties } from 'react';
import { getTheme } from 'core/utils/themes';
import { SelectComponentsProps } from 'react-select/base';

const theme = getTheme();

export default {
  valueContainer: (style: CSSProperties) => ({
    ...style,
    height: '41px',
    paddingLeft: 0
  }),
  singleValue: (style: CSSProperties, state: SelectComponentsProps) => ({
    ...style,
    top: '27px',
    color: state.isDisabled ? theme.select.disabled.color : theme.select.color
  }),
  input: (style: CSSProperties) => ({
    ...style,
    color: theme.select.color,
    position: 'absolute' as 'absolute',
    top: '18px'
  }),
  placeholder: (style: CSSProperties, state: SelectComponentsProps) => {
    const { selectProps, hasValue } = state;
    const { hasError } = selectProps;
    const labelPos =
      selectProps.menuIsOpen || selectProps.inputValue || hasValue;
    const color = hasError ? theme.input.error.color : theme.select.placeholder;

    return {
      ...style,
      position: 'absolute' as 'absolute',
      top: labelPos ? '7px' : '27px',
      transition: 'top 0.1s, font-size 0.1s',
      fontSize: labelPos ? '12px' : '14px',
      color
    };
  },
  loadingIndicator: (style: CSSProperties) => ({
    ...style,
    position: 'absolute' as 'absolute',
    top: 0,
    right: 0
  }),
  indicatorsContainer: (style: CSSProperties) => ({
    ...style,
    position: 'absolute' as 'absolute',
    bottom: '9px',
    right: 0
  }),
  control: (style: CSSProperties, state: SelectComponentsProps) => {
    const { hasError } = state.selectProps;

    let borderBottom = '';
    if (state.isDisabled) {
      borderBottom = theme.select.disabled.borderColor;
    } else if (hasError) {
      borderBottom = theme.input.error.borderColor;
    } else if (state.isFocused) {
      borderBottom = theme.select.focus.borderColor;
    } else {
      borderBottom = theme.select.borderColor;
    }

    return {
      ...style,
      border: 'none',
      borderRadius: '0',
      fontSize: '14px',
      backgroundColor: 'transparent',
      borderBottom: `1px solid ${borderBottom}`,
      boxShadow: '0',
      '&:hover': {
        borderBottom: `1px solid ${borderBottom}`
      }
    };
  },
  menu: (style: CSSProperties) => ({
    ...style,
    backgroundColor: theme.select.menu.background,
    color: theme.select.menu.color,
    marginTop: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0
  }),
  option: (style: CSSProperties, state: SelectComponentsProps) => ({
    ...style,
    backgroundColor: state.isFocused
      ? theme.select.menu.hover.background
      : theme.select.menu.background,
    fontSize: '12px',
    borderTop: `2px solid ${theme.select.menu.border}`,
    '&:hover': {
      backgroundColor: theme.select.menu.hover.background
    }
  })
};
