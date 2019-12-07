if (process.env.NODE_ENV === "production") {
  module.exports = require("./secret_pro");
} else {
  module.exports = require("./secret_dev");
}
