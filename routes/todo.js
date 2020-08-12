const express = require("express");
const { getMyTodos, setMyCompletedTodo } = require("../controllers/todo");

const router = express.Router();

router.route("/").get(getMyTodos).post(setMyCompletedTodo);

module.exports = router;
