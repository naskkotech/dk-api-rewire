// Initializes the `forgotPassword` service on path `/forgot-password`. (Can be re-generated.)
const createService = require("feathers-mongoose");
const createModel = require("../../../models/account/forgot-password.model");
const hooks = require("./forgot-password.hooks");
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
  app.use("/forgot-password", createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service("forgot-password");

  service.hooks(hooks);
  // !code: events
  service.on("created", data => {
    // Send confirmation email to the user
    mailQueue.add("sendForgotPasswordEMail", data);
  });
  // send resend confirmation email
  // eslint-disable-next-line
  service.on("patched", data => {
    // TODO after updating the user's password in the patch request, send an email notifying them of the password change.
    // mailQueue.add("resendConfirmEmail", data);
  });
  // !end
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
