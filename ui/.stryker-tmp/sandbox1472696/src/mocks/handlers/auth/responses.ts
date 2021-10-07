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

export const LOGIN_SUCCESS = stryMutAct_9fa48("2366") ? {} : (stryCov_9fa48("2366"), {
  access_token: stryMutAct_9fa48("2367") ? "" : (stryCov_9fa48("2367"), 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpcm9waWVJZS0yVUt5U0dxN1F5Q0J1bmpHR1h3TTVuQmFuQnJrSGtWODJFIn0.eyJleHAiOjE2MTQ2MDU1ODYsImlhdCI6MTYxNDYwMTk4NiwianRpIjoiNDRiODIyYmItMTIyZS00NzQ5LTkxOTQtM2EyZjRmMzJkMWQ4IiwiaXNzIjoiaHR0cHM6Ly9jaGFybGVzLXNhbmRib3guY29udGludW91c3BsYXRmb3JtLmNvbS9rZXljbG9hay9hdXRoL3JlYWxtcy9jaGFybGVzY2QiLCJhdWQiOiJkYXJ3aW4tY2xpZW50Iiwic3ViIjoiNzczOWIyNzQtYzMyNy00MDQxLWJjZTQtZDExODBmYzM0ODllIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY2hhcmxlc2NkLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJhMGUwNTE1ZS0wNzEwLTQwZWEtODk4My1lYjM3MWE1ZWM5MDYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzUm9vdCI6dHJ1ZSwibmFtZSI6IkNoYXJsZXMgQWRtaW4iLCJ3b3Jrc3BhY2VzIjpbeyJpZCI6IjhjNGVlNzZhLWNmMDItNGZjMi05MWRlLWU5Y2IwODk4NDk3ZCIsInBlcm1pc3Npb25zIjpbImh5cG90aGVzaXNfcmVhZCIsImNpcmNsZXNfcmVhZCIsIm1vZHVsZXNfcmVhZCIsImRlcGxveV93cml0ZSIsImNpcmNsZXNfd3JpdGUiLCJtYWludGVuYW5jZV93cml0ZSIsIm1vZHVsZXNfd3JpdGUiLCJoeXBvdGhlc2lzX3dyaXRlIl19LHsiaWQiOiI1YmQ0MWFkYS1mNWRlLTQwZTItOWJiZi1lODg4MzM3NjM4ZTEiLCJwZXJtaXNzaW9ucyI6WyJtb2R1bGVzX3dyaXRlIiwiY2lyY2xlc193cml0ZSIsIm1haW50ZW5hbmNlX3dyaXRlIiwibW9kdWxlc19yZWFkIiwiZGVwbG95X3dyaXRlIiwiaHlwb3RoZXNpc193cml0ZSIsImNpcmNsZXNfcmVhZCIsImh5cG90aGVzaXNfcmVhZCJdfV0sInByZWZlcnJlZF91c2VybmFtZSI6ImNoYXJsZXNhZG1pbkBhZG1pbiIsImdpdmVuX25hbWUiOiJDaGFybGVzIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImVtYWlsIjoiY2hhcmxlc2FkbWluQGFkbWluIn0.Uoqz40IBj2FYxVMYpJYhDmixpCMhCWsk4IrTf9v-emvf0TOsZqTZT6J_QhJLwOdZcgiamghKTkg0EY0r1Lo9YzgIQg3B1EW6cudhkftPdggDXhAOWHfzYclsds_VlAEFI20Z14S4-taORLiH5LKaRavweaAUvpoMxyKYG0wmKWjHxqitcZJD5G8xPiKy0v6rq2ZzUnKkrZjxyL4ahlx5aWxhr6Lles7FfqzNGXjHb7K59Wp4Hbq9yjdzUlRMv-naP-gRMwY_s5HVpiPth4wEtZUA_GTDweu-G_IBCHStoFQOOrQIstXq_TbuzCMbOytbL_4wt4LKAXUqz8ryQg-k4A'),
  expires_in: 3600,
  refresh_expires_in: 1800,
  refresh_token: stryMutAct_9fa48("2368") ? "" : (stryCov_9fa48("2368"), 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjYjIwMWIxMi1hMWFkLTQ0NmEtYWZjYS1hNzM1OTQzYzQxNWYifQ.eyJleHAiOjE2MTQ2MDM3ODYsImlhdCI6MTYxNDYwMTk4NiwianRpIjoiZTUxMGYxZjQtNDFmOS00MDViLTllZDYtMGE2MzJhMDg1NDhmIiwiaXNzIjoiaHR0cHM6Ly9jaGFybGVzLXNhbmRib3guY29udGludW91c3BsYXRmb3JtLmNvbS9rZXljbG9hay9hdXRoL3JlYWxtcy9jaGFybGVzY2QiLCJhdWQiOiJodHRwczovL2NoYXJsZXMtc2FuZGJveC5jb250aW51b3VzcGxhdGZvcm0uY29tL2tleWNsb2FrL2F1dGgvcmVhbG1zL2NoYXJsZXNjZCIsInN1YiI6Ijc3MzliMjc0LWMzMjctNDA0MS1iY2U0LWQxMTgwZmMzNDg5ZSIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJjaGFybGVzY2QtY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6ImEwZTA1MTVlLTA3MTAtNDBlYS04OTgzLWViMzcxYTVlYzkwNiIsInNjb3BlIjoicHJvZmlsZSBlbWFpbCJ9.X_K83Kv-Il9gfh9YqjJHnoNZAFtIJoK-uhcSUUVMNfU'),
  token_type: stryMutAct_9fa48("2369") ? "" : (stryCov_9fa48("2369"), 'bearer'),
  'not-before-policy': 0,
  session_state: stryMutAct_9fa48("2370") ? "" : (stryCov_9fa48("2370"), 'a0e0515e-0710-40ea-8983-eb371a5ec906'),
  scope: stryMutAct_9fa48("2371") ? "" : (stryCov_9fa48("2371"), 'profile email')
});