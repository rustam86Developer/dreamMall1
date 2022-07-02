global.CONFIG = require("./config");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

swaggerDocument["host"] = CONFIG.SWAGGER_HOST;

app
  .use(logger("dev"))
  .use(express.json({ limit: "100mb" }))
  .use(express.urlencoded({ extended: true, limit: "100mb" }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, "public")))
  .disable("x-powered-by")
  .use("/isv/v1.0", require("./routes/isv.js"))
  .use("/common", require("./routes/common.js"))
  .use("/engage", require("./routes/engage.js"))
  .use("/connect", require("./routes/connect.js"))
  .use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*"); // allow request from all origin
    response.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    response.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, refreshToken"
    );
    response.header("Content-Type: application/json", true);
    next();
  })

  .use(function(req, res, next) {
    next(createError(404));
  });

module.exports = app;
