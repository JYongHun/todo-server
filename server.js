const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const fileupload = require("express-fileupload");

// 미들웨어 에 대한 require
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");

const todo = require("./routes/todo");
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());
app.use(fileupload());

// app.use 는 순서가 중요!! 순서대로 실행을 시킵니다. next()로
// 미들웨어 연결
app.use(logger);
app.use(morgan("combined"));

app.use("/api/v1/todo", todo);

app.use(errorHandler);

const PORT = process.env.PORT || 4998;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV}mode on port ${PORT}`)
);
