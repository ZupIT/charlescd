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
// @ts-nocheck

function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import { CSSProperties } from 'react';
import { getTheme } from 'core/utils/themes';
import { SelectComponentsProps } from 'react-select/base';
const theme = getTheme();
export default stryMutAct_9fa48("758") ? {} : (stryCov_9fa48("758"), {
  valueContainer: stryMutAct_9fa48("759") ? () => undefined : (stryCov_9fa48("759"), (style: CSSProperties) => stryMutAct_9fa48("760") ? {} : (stryCov_9fa48("760"), { ...style,
    height: stryMutAct_9fa48("761") ? "" : (stryCov_9fa48("761"), '41px'),
    paddingLeft: 0
  })),
  singleValue: stryMutAct_9fa48("762") ? () => undefined : (stryCov_9fa48("762"), (style: CSSProperties, state: SelectComponentsProps) => stryMutAct_9fa48("763") ? {} : (stryCov_9fa48("763"), { ...style,
    top: stryMutAct_9fa48("764") ? "" : (stryCov_9fa48("764"), '27px'),
    color: state.isDisabled ? theme.select.disabled.color : theme.select.color
  })),
  input: stryMutAct_9fa48("765") ? () => undefined : (stryCov_9fa48("765"), (style: CSSProperties) => stryMutAct_9fa48("766") ? {} : (stryCov_9fa48("766"), { ...style,
    color: theme.select.color,
    position: ('absolute' as 'absolute'),
    top: stryMutAct_9fa48("767") ? "" : (stryCov_9fa48("767"), '18px')
  })),
  placeholder: (style: CSSProperties, state: SelectComponentsProps) => {
    if (stryMutAct_9fa48("768")) {
      {}
    } else {
      stryCov_9fa48("768");
      const {
        selectProps,
        hasValue
      } = state;
      const {
        hasError
      } = selectProps;
      const labelPos = stryMutAct_9fa48("771") ? (selectProps.menuIsOpen || selectProps.inputValue) && hasValue : stryMutAct_9fa48("770") ? false : stryMutAct_9fa48("769") ? true : (stryCov_9fa48("769", "770", "771"), (stryMutAct_9fa48("774") ? selectProps.menuIsOpen && selectProps.inputValue : stryMutAct_9fa48("773") ? false : stryMutAct_9fa48("772") ? true : (stryCov_9fa48("772", "773", "774"), selectProps.menuIsOpen || selectProps.inputValue)) || hasValue);
      const color = hasError ? theme.input.error.color : theme.select.placeholder;
      return stryMutAct_9fa48("775") ? {} : (stryCov_9fa48("775"), { ...style,
        position: ('absolute' as 'absolute'),
        top: labelPos ? stryMutAct_9fa48("776") ? "" : (stryCov_9fa48("776"), '7px') : stryMutAct_9fa48("777") ? "" : (stryCov_9fa48("777"), '27px'),
        transition: stryMutAct_9fa48("778") ? "" : (stryCov_9fa48("778"), 'top 0.1s, font-size 0.1s'),
        fontSize: labelPos ? stryMutAct_9fa48("779") ? "" : (stryCov_9fa48("779"), '12px') : stryMutAct_9fa48("780") ? "" : (stryCov_9fa48("780"), '14px'),
        color
      });
    }
  },
  loadingIndicator: stryMutAct_9fa48("781") ? () => undefined : (stryCov_9fa48("781"), (style: CSSProperties) => stryMutAct_9fa48("782") ? {} : (stryCov_9fa48("782"), { ...style,
    position: ('absolute' as 'absolute'),
    top: 0,
    right: 0
  })),
  indicatorsContainer: stryMutAct_9fa48("783") ? () => undefined : (stryCov_9fa48("783"), (style: CSSProperties) => stryMutAct_9fa48("784") ? {} : (stryCov_9fa48("784"), { ...style,
    position: ('absolute' as 'absolute'),
    bottom: stryMutAct_9fa48("785") ? "" : (stryCov_9fa48("785"), '9px'),
    right: 0
  })),
  control: (style: CSSProperties, state: SelectComponentsProps) => {
    if (stryMutAct_9fa48("786")) {
      {}
    } else {
      stryCov_9fa48("786");
      const {
        hasError
      } = state.selectProps;
      let borderBottom = stryMutAct_9fa48("787") ? "Stryker was here!" : (stryCov_9fa48("787"), '');

      if (stryMutAct_9fa48("789") ? false : stryMutAct_9fa48("788") ? true : (stryCov_9fa48("788", "789"), state.isDisabled)) {
        if (stryMutAct_9fa48("790")) {
          {}
        } else {
          stryCov_9fa48("790");
          borderBottom = theme.select.disabled.borderColor;
        }
      } else if (stryMutAct_9fa48("792") ? false : stryMutAct_9fa48("791") ? true : (stryCov_9fa48("791", "792"), hasError)) {
        if (stryMutAct_9fa48("793")) {
          {}
        } else {
          stryCov_9fa48("793");
          borderBottom = theme.input.error.borderColor;
        }
      } else if (stryMutAct_9fa48("795") ? false : stryMutAct_9fa48("794") ? true : (stryCov_9fa48("794", "795"), state.isFocused)) {
        if (stryMutAct_9fa48("796")) {
          {}
        } else {
          stryCov_9fa48("796");
          borderBottom = theme.select.focus.borderColor;
        }
      } else {
        if (stryMutAct_9fa48("797")) {
          {}
        } else {
          stryCov_9fa48("797");
          borderBottom = theme.select.borderColor;
        }
      }

      return stryMutAct_9fa48("798") ? {} : (stryCov_9fa48("798"), { ...style,
        border: stryMutAct_9fa48("799") ? "" : (stryCov_9fa48("799"), 'none'),
        borderRadius: stryMutAct_9fa48("800") ? "" : (stryCov_9fa48("800"), '0'),
        fontSize: stryMutAct_9fa48("801") ? "" : (stryCov_9fa48("801"), '14px'),
        backgroundColor: stryMutAct_9fa48("802") ? "" : (stryCov_9fa48("802"), 'transparent'),
        borderBottom: stryMutAct_9fa48("803") ? `` : (stryCov_9fa48("803"), `1px solid ${borderBottom}`),
        boxShadow: stryMutAct_9fa48("804") ? "" : (stryCov_9fa48("804"), '0'),
        '&:hover': stryMutAct_9fa48("805") ? {} : (stryCov_9fa48("805"), {
          borderBottom: stryMutAct_9fa48("806") ? `` : (stryCov_9fa48("806"), `1px solid ${borderBottom}`)
        })
      });
    }
  },
  menu: stryMutAct_9fa48("807") ? () => undefined : (stryCov_9fa48("807"), (style: CSSProperties) => stryMutAct_9fa48("808") ? {} : (stryCov_9fa48("808"), { ...style,
    backgroundColor: theme.select.menu.background,
    color: theme.select.menu.color,
    marginTop: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0
  })),
  option: stryMutAct_9fa48("809") ? () => undefined : (stryCov_9fa48("809"), (style: CSSProperties, state: SelectComponentsProps) => stryMutAct_9fa48("810") ? {} : (stryCov_9fa48("810"), { ...style,
    backgroundColor: state.isFocused ? theme.select.menu.hover.background : theme.select.menu.background,
    fontSize: stryMutAct_9fa48("811") ? "" : (stryCov_9fa48("811"), '12px'),
    borderTop: stryMutAct_9fa48("812") ? `` : (stryCov_9fa48("812"), `2px solid ${theme.select.menu.border}`),
    '&:hover': stryMutAct_9fa48("813") ? {} : (stryCov_9fa48("813"), {
      backgroundColor: theme.select.menu.hover.background
    })
  }))
});