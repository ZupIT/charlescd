// @ts-nocheck
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

export const DEFAULT_MAX_LENGTH = 100;
export const checkPoints = stryMutAct_9fa48("341") ? [] : (stryCov_9fa48("341"), [stryMutAct_9fa48("342") ? {} : (stryCov_9fa48("342"), {
  name: stryMutAct_9fa48("343") ? "" : (stryCov_9fa48("343"), 'Uppercase'),
  rule: stryMutAct_9fa48("344") ? () => undefined : (stryCov_9fa48("344"), (pass = stryMutAct_9fa48("345") ? "Stryker was here!" : (stryCov_9fa48("345"), '')) => new RegExp(stryMutAct_9fa48("346") ? /[^A-Z]/ : (stryCov_9fa48("346"), /[A-Z]/)).test(pass)),
  message: stryMutAct_9fa48("347") ? "" : (stryCov_9fa48("347"), 'Must have at least one uppercase character')
}), stryMutAct_9fa48("348") ? {} : (stryCov_9fa48("348"), {
  name: stryMutAct_9fa48("349") ? "" : (stryCov_9fa48("349"), 'Lowercase'),
  rule: stryMutAct_9fa48("350") ? () => undefined : (stryCov_9fa48("350"), (pass = stryMutAct_9fa48("351") ? "Stryker was here!" : (stryCov_9fa48("351"), '')) => new RegExp(stryMutAct_9fa48("352") ? /[^a-z]/ : (stryCov_9fa48("352"), /[a-z]/)).test(pass)),
  message: stryMutAct_9fa48("353") ? "" : (stryCov_9fa48("353"), 'Must have at least one lowercase character')
}), stryMutAct_9fa48("354") ? {} : (stryCov_9fa48("354"), {
  name: stryMutAct_9fa48("355") ? "" : (stryCov_9fa48("355"), 'Numbers'),
  rule: stryMutAct_9fa48("356") ? () => undefined : (stryCov_9fa48("356"), (pass = stryMutAct_9fa48("357") ? "Stryker was here!" : (stryCov_9fa48("357"), '')) => new RegExp(stryMutAct_9fa48("358") ? /[^0-9]/ : (stryCov_9fa48("358"), /[0-9]/)).test(pass)),
  message: stryMutAct_9fa48("359") ? "" : (stryCov_9fa48("359"), 'Must have at least one number')
}), stryMutAct_9fa48("360") ? {} : (stryCov_9fa48("360"), {
  name: stryMutAct_9fa48("361") ? "" : (stryCov_9fa48("361"), 'Special Character'),
  rule: stryMutAct_9fa48("362") ? () => undefined : (stryCov_9fa48("362"), (pass = stryMutAct_9fa48("363") ? "Stryker was here!" : (stryCov_9fa48("363"), '')) => new RegExp(stryMutAct_9fa48("364") ? /[^!@#$%^&*(),.?":{}|<>]/ : (stryCov_9fa48("364"), /[!@#$%^&*(),.?":{}|<>]/)).test(pass)),
  message: stryMutAct_9fa48("365") ? "" : (stryCov_9fa48("365"), 'Must have at least one special character')
}), stryMutAct_9fa48("366") ? {} : (stryCov_9fa48("366"), {
  name: stryMutAct_9fa48("367") ? "" : (stryCov_9fa48("367"), 'Minimum 10 and max of 100 characters'),
  rule: stryMutAct_9fa48("368") ? () => undefined : (stryCov_9fa48("368"), (pass = stryMutAct_9fa48("369") ? "Stryker was here!" : (stryCov_9fa48("369"), '')) => stryMutAct_9fa48("372") ? pass?.length >= 10 || pass?.length <= DEFAULT_MAX_LENGTH : stryMutAct_9fa48("371") ? false : stryMutAct_9fa48("370") ? true : (stryCov_9fa48("370", "371", "372"), (stryMutAct_9fa48("376") ? pass?.length < 10 : stryMutAct_9fa48("375") ? pass?.length > 10 : stryMutAct_9fa48("374") ? false : stryMutAct_9fa48("373") ? true : (stryCov_9fa48("373", "374", "375", "376"), (stryMutAct_9fa48("377") ? pass.length : (stryCov_9fa48("377"), pass?.length)) >= 10)) && (stryMutAct_9fa48("381") ? pass?.length > DEFAULT_MAX_LENGTH : stryMutAct_9fa48("380") ? pass?.length < DEFAULT_MAX_LENGTH : stryMutAct_9fa48("379") ? false : stryMutAct_9fa48("378") ? true : (stryCov_9fa48("378", "379", "380", "381"), (stryMutAct_9fa48("382") ? pass.length : (stryCov_9fa48("382"), pass?.length)) <= DEFAULT_MAX_LENGTH)))),
  message: stryMutAct_9fa48("383") ? "" : (stryCov_9fa48("383"), 'Must be between 10 and 100 characters')
}), stryMutAct_9fa48("384") ? {} : (stryCov_9fa48("384"), {
  name: stryMutAct_9fa48("385") ? "" : (stryCov_9fa48("385"), 'Confirm password'),
  rule: stryMutAct_9fa48("386") ? () => undefined : (stryCov_9fa48("386"), (pass = stryMutAct_9fa48("387") ? "Stryker was here!" : (stryCov_9fa48("387"), ''), confirm = stryMutAct_9fa48("388") ? "Stryker was here!" : (stryCov_9fa48("388"), '')) => stryMutAct_9fa48("391") ? pass !== '' || pass === confirm : stryMutAct_9fa48("390") ? false : stryMutAct_9fa48("389") ? true : (stryCov_9fa48("389", "390", "391"), (stryMutAct_9fa48("394") ? pass === '' : stryMutAct_9fa48("393") ? false : stryMutAct_9fa48("392") ? true : (stryCov_9fa48("392", "393", "394"), pass !== (stryMutAct_9fa48("395") ? "Stryker was here!" : (stryCov_9fa48("395"), '')))) && (stryMutAct_9fa48("398") ? pass !== confirm : stryMutAct_9fa48("397") ? false : stryMutAct_9fa48("396") ? true : (stryCov_9fa48("396", "397", "398"), pass === confirm)))),
  message: stryMutAct_9fa48("399") ? "" : (stryCov_9fa48("399"), 'Passwords do not match')
})]);