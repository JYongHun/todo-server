const express = require("express");
const auth = require("../middleware/auth");
const { createUser, loginUser, logout } = require("../controllers/users");

const router = express.Router();

//회원가입
router.route("/").post(createUser);
//로그인
router.route("/loginM").post(loginUser);
//로그아웃
router.route("/logoutM").delete(auth, logout);

module.exports = router;
