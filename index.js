"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const cors = require("cors");
const http = require("http");

const connections = require("./lib/connections.js");

connections.connectDB();

const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

const autentication = require("./autentication.js");

// Default security for all endpoints
app.use(autentication.verifyAutentication);

app.use("/login", autentication.signIn);

app.use("/session", autentication.validateSession);

const user = require("./routes/userRoutes.js");
app.use("/users", user);

const ride = require("./routes/rideRoutes.js");
app.use("/rides", ride);

const requests = require("./routes/requestsRoutes.js");
app.use("/requests", requests);

const algorithm = require("./routes/algorithmRoutes.js");
app.use("/recommend", algorithm);

const route = require("./routes/routeRoutes.js");
app.use("/routes", route);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(
    chalk.blue(`
   _______  ___  ______  ______ 
  |   __  ||   ||      ||   ___|
  |  |  | ||   ||  __  ||  |
  |  |__| ||   || |  | ||  |___ 
  |   ____||   || |  | ||   ___|
  |  |     |   || |__| ||  | 
  |  |     |   ||      ||  |___ 
  |__|     |___||______||______|
  `),
    chalk.yellow(` 
 _______  _______  _      _______  _______       ______ 
|   ____||       || |    |       ||___    |     |      |
|  |     |   _   || |    |   _   |    |   |     |  __  |
|  |     |  | |  || |    |  | |  | ___|   |     | |  | |
|  |     |  | |  || |    |  |_|  ||___    |     | |  | |
|  |     |  |_|  || |    |       |    |   | ___ | |__| |
|  |____ |       || |___ |   _   | ___|   ||   ||      |
|_______||_______||_____||__| |__||_______||___||______|`),
  );
  console.log(chalk.blue(`\nRunning in port ${port}`));
});
