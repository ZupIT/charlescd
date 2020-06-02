const keycloack = require("./auth");
const circles = require("./circles");
const users = require("./users");
const modules = require("./modules");
const metrics = require("./metrics");
const workspaces = require("./workspaces");
const usergroups = require("./user-groups");
const git = require("./git");
const registry = require("./registry");
const metricProvider = require("./metricProvider");
const userGroup = require("./userGroup");
const cdConfiguration = require("./cdConfiguration");
const roles = require("./roles");

module.exports = {
  keycloack,
  circles,
  users,
  modules,
  metrics,
  workspaces,
  usergroups,
  git,
  registry,
  metricProvider,
  userGroup,
  cdConfiguration,
  roles
};
