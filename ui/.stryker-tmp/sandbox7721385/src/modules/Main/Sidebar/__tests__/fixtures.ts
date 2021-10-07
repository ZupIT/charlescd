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

export const workspaceMenu = stryMutAct_9fa48("4643") ? [] : (stryCov_9fa48("4643"), [stryMutAct_9fa48("4644") ? {} : (stryCov_9fa48("4644"), {
  id: stryMutAct_9fa48("4645") ? "" : (stryCov_9fa48("4645"), 'menu-circles'),
  icon: stryMutAct_9fa48("4646") ? "" : (stryCov_9fa48("4646"), 'circles'),
  text: stryMutAct_9fa48("4647") ? "" : (stryCov_9fa48("4647"), 'Circles'),
  to: stryMutAct_9fa48("4648") ? "" : (stryCov_9fa48("4648"), '/circles'),
  action: stryMutAct_9fa48("4649") ? "" : (stryCov_9fa48("4649"), 'read'),
  subject: stryMutAct_9fa48("4650") ? "" : (stryCov_9fa48("4650"), 'circles')
}), stryMutAct_9fa48("4651") ? {} : (stryCov_9fa48("4651"), {
  id: stryMutAct_9fa48("4652") ? "" : (stryCov_9fa48("4652"), 'menu-hypotheses'),
  icon: stryMutAct_9fa48("4653") ? "" : (stryCov_9fa48("4653"), 'hypotheses'),
  text: stryMutAct_9fa48("4654") ? "" : (stryCov_9fa48("4654"), 'Hypotheses'),
  to: stryMutAct_9fa48("4655") ? "" : (stryCov_9fa48("4655"), '/hypotheses'),
  action: stryMutAct_9fa48("4656") ? "" : (stryCov_9fa48("4656"), 'read'),
  subject: stryMutAct_9fa48("4657") ? "" : (stryCov_9fa48("4657"), 'hypothesis')
}), stryMutAct_9fa48("4658") ? {} : (stryCov_9fa48("4658"), {
  id: stryMutAct_9fa48("4659") ? "" : (stryCov_9fa48("4659"), 'menu-modules'),
  icon: stryMutAct_9fa48("4660") ? "" : (stryCov_9fa48("4660"), 'modules'),
  text: stryMutAct_9fa48("4661") ? "" : (stryCov_9fa48("4661"), 'Modules'),
  to: stryMutAct_9fa48("4662") ? "" : (stryCov_9fa48("4662"), '/modules'),
  action: stryMutAct_9fa48("4663") ? "" : (stryCov_9fa48("4663"), 'read'),
  subject: stryMutAct_9fa48("4664") ? "" : (stryCov_9fa48("4664"), 'modules')
}), stryMutAct_9fa48("4665") ? {} : (stryCov_9fa48("4665"), {
  id: stryMutAct_9fa48("4666") ? "" : (stryCov_9fa48("4666"), 'menu-metrics'),
  icon: stryMutAct_9fa48("4667") ? "" : (stryCov_9fa48("4667"), 'metrics'),
  text: stryMutAct_9fa48("4668") ? "" : (stryCov_9fa48("4668"), 'Metrics'),
  to: stryMutAct_9fa48("4669") ? "" : (stryCov_9fa48("4669"), '/metrics'),
  action: stryMutAct_9fa48("4670") ? "" : (stryCov_9fa48("4670"), 'read'),
  subject: stryMutAct_9fa48("4671") ? "" : (stryCov_9fa48("4671"), 'circles')
}), stryMutAct_9fa48("4672") ? {} : (stryCov_9fa48("4672"), {
  id: stryMutAct_9fa48("4673") ? "" : (stryCov_9fa48("4673"), 'menu-settings'),
  icon: stryMutAct_9fa48("4674") ? "" : (stryCov_9fa48("4674"), 'settings'),
  text: stryMutAct_9fa48("4675") ? "" : (stryCov_9fa48("4675"), 'Settings'),
  to: stryMutAct_9fa48("4676") ? "" : (stryCov_9fa48("4676"), '/settings/credentials'),
  action: stryMutAct_9fa48("4677") ? "" : (stryCov_9fa48("4677"), 'write'),
  subject: stryMutAct_9fa48("4678") ? "" : (stryCov_9fa48("4678"), 'maintenance')
})]);
export const mainMenu = stryMutAct_9fa48("4679") ? [] : (stryCov_9fa48("4679"), [stryMutAct_9fa48("4680") ? {} : (stryCov_9fa48("4680"), {
  id: stryMutAct_9fa48("4681") ? "" : (stryCov_9fa48("4681"), 'menu-workspaces'),
  icon: stryMutAct_9fa48("4682") ? "" : (stryCov_9fa48("4682"), 'workspaces'),
  text: stryMutAct_9fa48("4683") ? "" : (stryCov_9fa48("4683"), 'Workspaces'),
  to: stryMutAct_9fa48("4684") ? "" : (stryCov_9fa48("4684"), '/workspaces')
}), stryMutAct_9fa48("4685") ? {} : (stryCov_9fa48("4685"), {
  id: stryMutAct_9fa48("4686") ? "" : (stryCov_9fa48("4686"), 'menu-account'),
  icon: stryMutAct_9fa48("4687") ? "" : (stryCov_9fa48("4687"), 'account'),
  text: stryMutAct_9fa48("4688") ? "" : (stryCov_9fa48("4688"), 'Account'),
  to: stryMutAct_9fa48("4689") ? "" : (stryCov_9fa48("4689"), '/account')
})]);
export const rootMainMenu = stryMutAct_9fa48("4690") ? [] : (stryCov_9fa48("4690"), [stryMutAct_9fa48("4691") ? {} : (stryCov_9fa48("4691"), {
  id: stryMutAct_9fa48("4692") ? "" : (stryCov_9fa48("4692"), 'menu-workspaces'),
  icon: stryMutAct_9fa48("4693") ? "" : (stryCov_9fa48("4693"), 'workspace'),
  text: stryMutAct_9fa48("4694") ? "" : (stryCov_9fa48("4694"), 'Workspaces'),
  to: stryMutAct_9fa48("4695") ? "" : (stryCov_9fa48("4695"), '/workspaces')
}), stryMutAct_9fa48("4696") ? {} : (stryCov_9fa48("4696"), {
  id: stryMutAct_9fa48("4697") ? "" : (stryCov_9fa48("4697"), 'menu-users'),
  icon: stryMutAct_9fa48("4698") ? "" : (stryCov_9fa48("4698"), 'user'),
  text: stryMutAct_9fa48("4699") ? "" : (stryCov_9fa48("4699"), 'Users'),
  to: stryMutAct_9fa48("4700") ? "" : (stryCov_9fa48("4700"), '/users')
}), stryMutAct_9fa48("4701") ? {} : (stryCov_9fa48("4701"), {
  id: stryMutAct_9fa48("4702") ? "" : (stryCov_9fa48("4702"), 'menu-groups'),
  icon: stryMutAct_9fa48("4703") ? "" : (stryCov_9fa48("4703"), 'users'),
  text: stryMutAct_9fa48("4704") ? "" : (stryCov_9fa48("4704"), 'User Group'),
  to: stryMutAct_9fa48("4705") ? "" : (stryCov_9fa48("4705"), '/groups')
}), stryMutAct_9fa48("4706") ? {} : (stryCov_9fa48("4706"), {
  id: stryMutAct_9fa48("4707") ? "" : (stryCov_9fa48("4707"), 'menu-account'),
  icon: stryMutAct_9fa48("4708") ? "" : (stryCov_9fa48("4708"), 'account'),
  text: stryMutAct_9fa48("4709") ? "" : (stryCov_9fa48("4709"), 'Account'),
  to: stryMutAct_9fa48("4710") ? "" : (stryCov_9fa48("4710"), '/account')
})]);