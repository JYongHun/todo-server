const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const morgan = require("morgan");

const users = require("./routes/users");
const rentalj = require("./routes/rental");

const app = express();

app.use(express.json());

app.use(morgan("common"));

app.use("/api/v1/booksuserj", users);
app.use("/api/v1/booksrentalj", rentalj);
const PORT = process.env.PORT || 5551;
app.listen(PORT, console.log("JYP SERVER"));
