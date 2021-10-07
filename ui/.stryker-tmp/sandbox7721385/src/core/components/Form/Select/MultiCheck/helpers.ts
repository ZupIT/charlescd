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

import { ActionMeta, OptionTypeBase } from 'react-select';
import { allOption } from './constants';
import { Option } from '../interfaces';
export const handleChange = (selected: Option[], event: ActionMeta<OptionTypeBase>, onChange: (event: Option[]) => void, options: Option[]) => {
  if (stryMutAct_9fa48("719")) {
    {}
  } else {
    stryCov_9fa48("719");

    if (stryMutAct_9fa48("722") ? selected !== null || selected.length > 0 : stryMutAct_9fa48("721") ? false : stryMutAct_9fa48("720") ? true : (stryCov_9fa48("720", "721", "722"), (stryMutAct_9fa48("725") ? selected === null : stryMutAct_9fa48("724") ? false : stryMutAct_9fa48("723") ? true : (stryCov_9fa48("723", "724", "725"), selected !== null)) && (stryMutAct_9fa48("729") ? selected.length <= 0 : stryMutAct_9fa48("728") ? selected.length >= 0 : stryMutAct_9fa48("727") ? false : stryMutAct_9fa48("726") ? true : (stryCov_9fa48("726", "727", "728", "729"), selected.length > 0)))) {
      if (stryMutAct_9fa48("730")) {
        {}
      } else {
        stryCov_9fa48("730");

        if (stryMutAct_9fa48("733") ? selected[selected.length - 1].value !== allOption.value : stryMutAct_9fa48("732") ? false : stryMutAct_9fa48("731") ? true : (stryCov_9fa48("731", "732", "733"), selected[stryMutAct_9fa48("734") ? selected.length + 1 : (stryCov_9fa48("734"), selected.length - 1)].value === allOption.value)) {
          if (stryMutAct_9fa48("735")) {
            {}
          } else {
            stryCov_9fa48("735");
            return onChange(stryMutAct_9fa48("736") ? [] : (stryCov_9fa48("736"), [allOption, ...options]));
          }
        }

        let result: Option[] = stryMutAct_9fa48("737") ? ["Stryker was here"] : (stryCov_9fa48("737"), []);

        if (stryMutAct_9fa48("740") ? selected.length !== options.length : stryMutAct_9fa48("739") ? false : stryMutAct_9fa48("738") ? true : (stryCov_9fa48("738", "739", "740"), selected.length === options.length)) {
          if (stryMutAct_9fa48("741")) {
            {}
          } else {
            stryCov_9fa48("741");

            if (stryMutAct_9fa48("743") ? false : stryMutAct_9fa48("742") ? true : (stryCov_9fa48("742", "743"), selected.includes(allOption))) {
              if (stryMutAct_9fa48("744")) {
                {}
              } else {
                stryCov_9fa48("744");
                result = selected.filter(stryMutAct_9fa48("745") ? () => undefined : (stryCov_9fa48("745"), option => stryMutAct_9fa48("748") ? option.value === allOption.value : stryMutAct_9fa48("747") ? false : stryMutAct_9fa48("746") ? true : (stryCov_9fa48("746", "747", "748"), option.value !== allOption.value)));
              }
            } else if (stryMutAct_9fa48("751") ? event.action !== 'select-option' : stryMutAct_9fa48("750") ? false : stryMutAct_9fa48("749") ? true : (stryCov_9fa48("749", "750", "751"), event.action === (stryMutAct_9fa48("752") ? "" : (stryCov_9fa48("752"), 'select-option')))) {
              if (stryMutAct_9fa48("753")) {
                {}
              } else {
                stryCov_9fa48("753");
                result = stryMutAct_9fa48("754") ? [] : (stryCov_9fa48("754"), [allOption, ...options]);
              }
            }

            return onChange(result);
          }
        }
      }
    }

    return onChange(selected);
  }
};