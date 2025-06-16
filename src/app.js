const express = require("express");
const compression = require("compression");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./database");

const router = require("./routes");
class App {
  #app;
  constructor() {
    this.#initMiddleware();
  }
  #initMiddleware() {
  this.#app = express(); 
  const path = require('path');
  this.#app.use(express.static(path.join(__dirname, '..', 'public')));

  this.#app.use([
    compression(),
    express.urlencoded({ extended: false }),
    express.json(),
    cors(),
  ]);

  this.#app.use("/api/v1/", router);

  this.#app.use((req, res) => {
    res.status(404).json({
      status: 404,
      message: "not found Route"
    });
  });

  connectDB();
}

  appListen() {
    this.#app.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT}/api/v1/`);
    });
  }
}
const app = new App();
app.appListen();
