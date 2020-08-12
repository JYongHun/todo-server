const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connection = require("../db/mysql_connection");

// @desc        모든책목록 불러오기
// @route       POST /api/v1/booksuserj
// @request     offset
// @response    id, title, author, limit_age
exports.getAllboojk = async (req, res, next) => {
  let offset = req.query.offset;
  //   let user_id = req.user.id;
  //   let token = req.user.token;

  console.log(offset);
  let query = `SELECT * FROM book LIMIT ${offset}, 25`;
  let data = [offset];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, result: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc        책한권선택 대여
// @route       POST /api/v1/booksrentalj/getRentalboojk
// @request     token(header), user_id(auth), book_id
// @response    success
exports.getRentalboojk = async (req, res, next) => {
  let user_id = req.user.id;
  let book_id = req.body.bookid;

  //연령제한 체크 book_user Table Add age
  let query =
    "SELECT * " +
    "FROM book_user AS BU " +
    "JOIN book AS B " +
    "WHERE BU.age >= B.limit_age " +
    "AND B.id = ? AND BU.id = ?";
  let data = [book_id, user_id];

  try {
    [result] = await connection.query(query, data);
    console.log(result.length);
    console.log(result);
    if (result.length == 0) {
      res.status(200).json({ success: false, age: "low age" });
      return;
    }
    //res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
    return;
  }

  query =
    "insert into book_rental (user_id, book_id,limit_date) values (?,?,DATE_ADD(NOW(), INTERVAL 7 DAY))";
  data = [user_id, book_id];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc        내가 대여한 책목록 보기
// @route       get /api/v1/booksrentalj/getMyRentalboojk
// @request     user_id(auth), offset
// @response    rental_date,limit_date, title, author, limit_age
exports.getMyRentalboojk = async (req, res, next) => {
  let user_id = req.user.id;
  let offset = req.query.offset;

  let query =
    "SELECT rental_date, limit_date, title, author, limit_age " +
    "FROM book_rental AS BR " +
    "LEFT JOIN book AS B " +
    "ON BR.book_id = B.id " +
    `WHERE BR.user_id = ? LIMIT ${offset}, 25`;
  let data = [user_id];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, result: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc        책반납
// @route       DELETE /api/v1/booksrentalj/getReturnboojk
// @request     token(header), user_id(auth), book_id
// @response    success
exports.getReturnboojk = async (req, res, next) => {
  let user_id = req.user.id;
  let book_id = req.body.bookid;

  let query = "delete from book_rental where user_id = ? and book_id = ?";
  let data = [user_id, book_id];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
