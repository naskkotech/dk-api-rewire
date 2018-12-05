// Application hooks that run for every service. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
// eslint-disable-next-line no-unused-vars
const authenticate = require('./hooks/authenticate');
// eslint-disable-next-line no-unused-vars
const authorizeAction = require('./hooks/authorize-action');
// eslint-disable-next-line no-unused-vars
const escapeAuthCheck = require('./hooks/escape-auth-check');
// eslint-disable-next-line no-unused-vars
const logToHistory = require('./hooks/log-to-history');
// !<DEFAULT> code: imports
const log = require('./hooks/log');
// !end

// !code: used
// eslint-disable-next-line no-unused-vars
const {
  iff,
  when,
  isProvider
} = commonHooks;
// !end
// !code: init
const shouldLogToHistory = () => {
  return iff(isProvider('external'), logToHistory());
};

const shouldAuthorizeAction = () => {
  return when(escapeAuthCheck(), authenticate(), authorizeAction({}));
};
// !end

let moduleExports = {
  before: {
    // !code: before
    all: [
      log(),
      shouldLogToHistory(),
      iff(isProvider('external'), shouldAuthorizeAction()),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  after: {
    // !code: after
    all: [
      log(),
      shouldLogToHistory()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  error: {
    // !code: error
    all: [
      log(),
      shouldLogToHistory()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
