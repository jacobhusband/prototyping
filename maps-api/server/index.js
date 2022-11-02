require("dotenv/config");

const express = require("express");
const cors = require("cors");
const path = require("path");
const pg = require("pg");

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const publicPath = path.join(__dirname, "public");

const app = express();

const staticMiddleware = express.static(publicPath);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.use(staticMiddleware);

app.use(cors);

app.listen(3000, () => {
  console.log("Server is running on PORT 3000.");
});
