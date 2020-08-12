const connection = require("../db/mysql_connection");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// @desc    할일 목록 불러오기
// @URL   GET /api/v1/todo
// @request
// @response
exports.getMyTodos = async (req, res, next) => {
  let offset = req.query.offset;
  let query = `SELECT * FROM todo LIMIT ${offset},25`;

  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, result: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc    완료 여부 체크 및 해제 하는 API
// @route   POST /api/v1/todo
// @request todoId
exports.setMyCompletedTodo = async (req, res, next) => {
  let todoId = req.body.todoId;

  let query =
    "UPDATE todo SET completed = if( completed = '1', '0', '1' ) WHERE id = ?;";
  let data = [todoId];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, result: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
