const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connection = require("../db/mysql_connection");

// @desc     회원가입
// @route   POST /api/v1/users
// @request email, passwd
// @response    success
exports.createUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  if (!email || !passwd) {
    res.status(400).json();
    return;
  }
  if (!validator.isEmail(email)) {
    res.status(400).json();
    return;
  }

  const hashedPasswd = await bcrypt.hash(passwd, 8);

  let query = "insert into book_user (email, passwd) values (?,?)";
  let data = [email, hashedPasswd];

  let user_id;

  const conn = await connection.getConnection();
  await conn.beginTransaction();

  try {
    [result] = await conn.query(query, data);
    user_id = result.insertId;
  } catch (e) {
    await conn.rollback();
    res.status(500).json();
    return;
  }

  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = "insert into book_user_token (user_id, token) values (?,?)";
  data = [user_id, token];

  try {
    [result] = await conn.query(query, data);
  } catch (e) {
    await conn.rollback();
    res.status(500).json();
    return;
  }

  await conn.commit();
  await conn.release();
  res.status(200).json({ success: true, token: token });
};

// @desc     로그인
// @route    POST /api/v1/users/login
// @request  email, passwd
// @response success, token
exports.loginUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  let query = "select * from book_user where email = ? ";
  let data = [email];

  let user_id;

  try {
    [rows] = await connection.query(query, data);
    let hashedPasswd = rows[0].passwd;
    user_id = rows[0].id;
    const isMatch = await bcrypt.compare(passwd, hashedPasswd);
    if (isMatch == false) {
      res.status(401).json();
      return;
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
    return;
  }
  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = "insert into book_user_token (user_id, token) values (?,?)";
  data = [user_id, token];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, token: token });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc        로그아웃 (기기1대 로그아웃)
// @route       POST /api/v1/users/logout
// @request     token(header), user_id(auth)
// @response    success

exports.logout = async (req, res, next) => {
  let user_id = req.user.id;
  let token = req.user.token;

  let query = "delete from book_user_token where user_id = ? and token = ?";
  let data = [user_id, token];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
