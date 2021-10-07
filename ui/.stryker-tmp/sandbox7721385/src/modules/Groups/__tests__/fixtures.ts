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

export const userGroupPagination = stryMutAct_9fa48("4430") ? {} : (stryCov_9fa48("4430"), {
  content: stryMutAct_9fa48("4431") ? [] : (stryCov_9fa48("4431"), [stryMutAct_9fa48("4432") ? {} : (stryCov_9fa48("4432"), {
    id: stryMutAct_9fa48("4433") ? "" : (stryCov_9fa48("4433"), '123'),
    name: stryMutAct_9fa48("4434") ? "" : (stryCov_9fa48("4434"), 'group 1'),
    users: stryMutAct_9fa48("4435") ? [] : (stryCov_9fa48("4435"), [stryMutAct_9fa48("4436") ? {} : (stryCov_9fa48("4436"), {
      id: stryMutAct_9fa48("4437") ? "" : (stryCov_9fa48("4437"), '123'),
      name: stryMutAct_9fa48("4438") ? "" : (stryCov_9fa48("4438"), 'Charles'),
      email: stryMutAct_9fa48("4439") ? "" : (stryCov_9fa48("4439"), 'charlescd@zup.com.br'),
      photoUrl: stryMutAct_9fa48("4440") ? "" : (stryCov_9fa48("4440"), 'https://charlescd.io'),
      createdAt: stryMutAct_9fa48("4441") ? "" : (stryCov_9fa48("4441"), '2020-01-01 12:00')
    })])
  })]),
  page: 0,
  size: 0,
  totalPages: 0,
  last: stryMutAct_9fa48("4442") ? false : (stryCov_9fa48("4442"), true)
});
export const userGroup = stryMutAct_9fa48("4443") ? {} : (stryCov_9fa48("4443"), {
  id: stryMutAct_9fa48("4444") ? "" : (stryCov_9fa48("4444"), '123'),
  name: stryMutAct_9fa48("4445") ? "" : (stryCov_9fa48("4445"), 'group 1'),
  author: stryMutAct_9fa48("4446") ? {} : (stryCov_9fa48("4446"), {
    id: stryMutAct_9fa48("4447") ? "" : (stryCov_9fa48("4447"), '456'),
    name: stryMutAct_9fa48("4448") ? "" : (stryCov_9fa48("4448"), 'Charles'),
    email: stryMutAct_9fa48("4449") ? "" : (stryCov_9fa48("4449"), 'charlescd@zup.com.br'),
    createdAt: stryMutAct_9fa48("4450") ? "" : (stryCov_9fa48("4450"), '2020-01-01 12:00')
  }),
  createdAt: stryMutAct_9fa48("4451") ? "" : (stryCov_9fa48("4451"), '2020-01-01 12:00'),
  users: stryMutAct_9fa48("4452") ? [] : (stryCov_9fa48("4452"), [stryMutAct_9fa48("4453") ? {} : (stryCov_9fa48("4453"), {
    id: stryMutAct_9fa48("4454") ? "" : (stryCov_9fa48("4454"), '123'),
    name: stryMutAct_9fa48("4455") ? "" : (stryCov_9fa48("4455"), 'Charles'),
    email: stryMutAct_9fa48("4456") ? "" : (stryCov_9fa48("4456"), 'charlescd@zup.com.br'),
    photoUrl: stryMutAct_9fa48("4457") ? "" : (stryCov_9fa48("4457"), 'https://charlescd.io'),
    createdAt: stryMutAct_9fa48("4458") ? "" : (stryCov_9fa48("4458"), '2020-01-01 12:00')
  })])
});
export const users = stryMutAct_9fa48("4459") ? {} : (stryCov_9fa48("4459"), {
  content: stryMutAct_9fa48("4460") ? [] : (stryCov_9fa48("4460"), [stryMutAct_9fa48("4461") ? {} : (stryCov_9fa48("4461"), {
    id: stryMutAct_9fa48("4462") ? "" : (stryCov_9fa48("4462"), '123'),
    name: stryMutAct_9fa48("4463") ? "" : (stryCov_9fa48("4463"), 'Charles'),
    email: stryMutAct_9fa48("4464") ? "" : (stryCov_9fa48("4464"), 'charlescd@zup.com.br'),
    photoUrl: stryMutAct_9fa48("4465") ? "" : (stryCov_9fa48("4465"), 'https://charlescd.io'),
    applications: stryMutAct_9fa48("4466") ? [] : (stryCov_9fa48("4466"), [stryMutAct_9fa48("4467") ? {} : (stryCov_9fa48("4467"), {
      id: stryMutAct_9fa48("4468") ? "" : (stryCov_9fa48("4468"), '123'),
      name: stryMutAct_9fa48("4469") ? "" : (stryCov_9fa48("4469"), 'Application 1'),
      menbersCount: 1
    })]),
    createdAt: stryMutAct_9fa48("4470") ? "" : (stryCov_9fa48("4470"), '2020-01-01 12:00')
  })]),
  page: 0,
  size: 0,
  totalPages: 0,
  last: stryMutAct_9fa48("4471") ? false : (stryCov_9fa48("4471"), true)
});