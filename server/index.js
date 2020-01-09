const express = require("express");
const bodyParser = require("body-parser");
// const pino = require("express-pino-logger")();
const ServiceLayer = require("./src/main/ServiceLayer");
const service = new ServiceLayer();

const port = 3001;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(pino);

app.get("/api/login", (req, res) => {
  const username = req.query.username || "";
  const password = req.query.password || "";
  const result = service.login(username, password);
  res.send(JSON.stringify({ result }));
});

app.listen(port, () =>
  console.log("Express server is running on localhost:", port)
);
