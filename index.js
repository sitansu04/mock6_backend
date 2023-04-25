const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db.js");
const { apiRouter } = require("./routes/api.routes.js");
require("dotenv").config();
const app = express();
app.use(express.json());
const port = 8080;
app.use(cors());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  try {
    res.send({ msg: "Welcome to flight Booking System" });
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

app.listen(port, async () => {
  try {
    await connection;
    console.log(`connected to DB`);
  } catch (error) {
    console.log(error);
  }
});
