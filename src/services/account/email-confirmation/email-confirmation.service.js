// Initializes the `emailConfirmation` service on path `/email-confirmation`. (Can be re-generated.)
const createService = require("feathers-mongoose");
const createModel = require("../../../models/account/email-confirmation.model");
const hooks = require("./email-confirmation.hooks");
// !code: imports
const { mailQueue } = require("./../../../queues");
// !end
// !code: init // !end

let moduleExports = function(app) {
  let Model = createModel(app);
  let paginate = app.get("paginate");
  // !code: func_init // !end

  let options = {
    Model,
    paginate
    // !code: options_more // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires
  app.use("/email-confirmation", createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service("email-confirmation");

  service.hooks(hooks);
  service.on("patched", data => {
    mailQueue.add("resendConfirmEmail", data);
  });
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
