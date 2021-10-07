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

import { Role, UserGroup } from "../interfaces";
export const UserGroups: UserGroup[] = stryMutAct_9fa48("6097") ? [] : (stryCov_9fa48("6097"), [stryMutAct_9fa48("6098") ? {} : (stryCov_9fa48("6098"), {
  id: stryMutAct_9fa48("6099") ? "" : (stryCov_9fa48("6099"), '1'),
  name: stryMutAct_9fa48("6100") ? "" : (stryCov_9fa48("6100"), 'Maintainer')
})]);
export const Roles: Role[] = stryMutAct_9fa48("6101") ? [] : (stryCov_9fa48("6101"), [stryMutAct_9fa48("6102") ? {} : (stryCov_9fa48("6102"), {
  id: stryMutAct_9fa48("6103") ? "" : (stryCov_9fa48("6103"), "fake-maintainer"),
  name: stryMutAct_9fa48("6104") ? "" : (stryCov_9fa48("6104"), "Maintainer"),
  description: stryMutAct_9fa48("6105") ? "" : (stryCov_9fa48("6105"), "Can access and edit this workspace's settings. Can deploy. Can also create, edit and delet: circles, modules and hypotheses."),
  permissions: stryMutAct_9fa48("6106") ? [] : (stryCov_9fa48("6106"), [stryMutAct_9fa48("6107") ? {} : (stryCov_9fa48("6107"), {
    id: stryMutAct_9fa48("6108") ? "" : (stryCov_9fa48("6108"), "fake-id"),
    name: stryMutAct_9fa48("6109") ? "" : (stryCov_9fa48("6109"), "fake-permission"),
    createdAt: stryMutAct_9fa48("6110") ? "" : (stryCov_9fa48("6110"), "2020-11-16 17:24:55")
  })]),
  createdAt: stryMutAct_9fa48("6111") ? "" : (stryCov_9fa48("6111"), "2020-11-16 17:24:55")
}), stryMutAct_9fa48("6112") ? {} : (stryCov_9fa48("6112"), {
  id: stryMutAct_9fa48("6113") ? "" : (stryCov_9fa48("6113"), "fake-developer"),
  name: stryMutAct_9fa48("6114") ? "" : (stryCov_9fa48("6114"), "Developer"),
  description: stryMutAct_9fa48("6115") ? "" : (stryCov_9fa48("6115"), "fake-developer."),
  permissions: stryMutAct_9fa48("6116") ? [] : (stryCov_9fa48("6116"), [stryMutAct_9fa48("6117") ? {} : (stryCov_9fa48("6117"), {
    id: stryMutAct_9fa48("6118") ? "" : (stryCov_9fa48("6118"), "fake-id"),
    name: stryMutAct_9fa48("6119") ? "" : (stryCov_9fa48("6119"), "fake-permission"),
    createdAt: stryMutAct_9fa48("6120") ? "" : (stryCov_9fa48("6120"), "2020-11-16 17:24:55")
  })]),
  createdAt: stryMutAct_9fa48("6121") ? "" : (stryCov_9fa48("6121"), "2020-11-16 17:24:55")
}), stryMutAct_9fa48("6122") ? {} : (stryCov_9fa48("6122"), {
  id: stryMutAct_9fa48("6123") ? "" : (stryCov_9fa48("6123"), "fake-reader"),
  name: stryMutAct_9fa48("6124") ? "" : (stryCov_9fa48("6124"), "Reader"),
  description: stryMutAct_9fa48("6125") ? "" : (stryCov_9fa48("6125"), "fake-reader."),
  permissions: stryMutAct_9fa48("6126") ? [] : (stryCov_9fa48("6126"), [stryMutAct_9fa48("6127") ? {} : (stryCov_9fa48("6127"), {
    id: stryMutAct_9fa48("6128") ? "" : (stryCov_9fa48("6128"), "fake-id"),
    name: stryMutAct_9fa48("6129") ? "" : (stryCov_9fa48("6129"), "fake-permission"),
    createdAt: stryMutAct_9fa48("6130") ? "" : (stryCov_9fa48("6130"), "2020-11-16 17:24:55")
  })]),
  createdAt: stryMutAct_9fa48("6131") ? "" : (stryCov_9fa48("6131"), "2020-11-16 17:24:55")
})]);
export const userGroups = stryMutAct_9fa48("6132") ? [] : (stryCov_9fa48("6132"), [stryMutAct_9fa48("6133") ? {} : (stryCov_9fa48("6133"), {
  id: stryMutAct_9fa48("6134") ? "" : (stryCov_9fa48("6134"), '1'),
  name: stryMutAct_9fa48("6135") ? "" : (stryCov_9fa48("6135"), 'devx user group'),
  users: stryMutAct_9fa48("6136") ? [] : (stryCov_9fa48("6136"), [stryMutAct_9fa48("6137") ? {} : (stryCov_9fa48("6137"), {
    id: stryMutAct_9fa48("6138") ? "" : (stryCov_9fa48("6138"), '12'),
    name: stryMutAct_9fa48("6139") ? "" : (stryCov_9fa48("6139"), 'user 1'),
    email: stryMutAct_9fa48("6140") ? "" : (stryCov_9fa48("6140"), 'user1@gmail.com')
  })])
}), stryMutAct_9fa48("6141") ? {} : (stryCov_9fa48("6141"), {
  id: stryMutAct_9fa48("6142") ? "" : (stryCov_9fa48("6142"), '2'),
  name: stryMutAct_9fa48("6143") ? "" : (stryCov_9fa48("6143"), 'metrics user group'),
  users: stryMutAct_9fa48("6144") ? [] : (stryCov_9fa48("6144"), [stryMutAct_9fa48("6145") ? {} : (stryCov_9fa48("6145"), {
    id: stryMutAct_9fa48("6146") ? "" : (stryCov_9fa48("6146"), '34'),
    name: stryMutAct_9fa48("6147") ? "" : (stryCov_9fa48("6147"), 'user 2'),
    email: stryMutAct_9fa48("6148") ? "" : (stryCov_9fa48("6148"), 'user2@gmail.com')
  })])
})]);
export const userGroupsWithSameUser = stryMutAct_9fa48("6149") ? [] : (stryCov_9fa48("6149"), [stryMutAct_9fa48("6150") ? {} : (stryCov_9fa48("6150"), {
  id: stryMutAct_9fa48("6151") ? "" : (stryCov_9fa48("6151"), '1'),
  name: stryMutAct_9fa48("6152") ? "" : (stryCov_9fa48("6152"), 'devx user group'),
  users: stryMutAct_9fa48("6153") ? [] : (stryCov_9fa48("6153"), [stryMutAct_9fa48("6154") ? {} : (stryCov_9fa48("6154"), {
    id: stryMutAct_9fa48("6155") ? "" : (stryCov_9fa48("6155"), '12'),
    name: stryMutAct_9fa48("6156") ? "" : (stryCov_9fa48("6156"), 'user 1'),
    email: stryMutAct_9fa48("6157") ? "" : (stryCov_9fa48("6157"), 'user1@gmail.com')
  })])
}), stryMutAct_9fa48("6158") ? {} : (stryCov_9fa48("6158"), {
  id: stryMutAct_9fa48("6159") ? "" : (stryCov_9fa48("6159"), '2'),
  name: stryMutAct_9fa48("6160") ? "" : (stryCov_9fa48("6160"), 'metrics user group'),
  users: stryMutAct_9fa48("6161") ? [] : (stryCov_9fa48("6161"), [stryMutAct_9fa48("6162") ? {} : (stryCov_9fa48("6162"), {
    id: stryMutAct_9fa48("6163") ? "" : (stryCov_9fa48("6163"), '12'),
    name: stryMutAct_9fa48("6164") ? "" : (stryCov_9fa48("6164"), 'user 1'),
    email: stryMutAct_9fa48("6165") ? "" : (stryCov_9fa48("6165"), 'user1@gmail.com')
  })])
})]);
export const userGroup = stryMutAct_9fa48("6166") ? [] : (stryCov_9fa48("6166"), [stryMutAct_9fa48("6167") ? {} : (stryCov_9fa48("6167"), {
  id: stryMutAct_9fa48("6168") ? "" : (stryCov_9fa48("6168"), '1'),
  name: stryMutAct_9fa48("6169") ? "" : (stryCov_9fa48("6169"), 'devx'),
  users: stryMutAct_9fa48("6170") ? [] : (stryCov_9fa48("6170"), [stryMutAct_9fa48("6171") ? {} : (stryCov_9fa48("6171"), {
    id: stryMutAct_9fa48("6172") ? "" : (stryCov_9fa48("6172"), '12'),
    name: stryMutAct_9fa48("6173") ? "" : (stryCov_9fa48("6173"), 'user 1'),
    email: stryMutAct_9fa48("6174") ? "" : (stryCov_9fa48("6174"), 'user1@gmail.com')
  })])
})]);