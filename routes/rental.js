const express = require("express");
const auth = require("../middleware/auth");
const {
  getAllboojk,
  getRentalboojk,
  getMyRentalboojk,
  getReturnboojk,
} = require("../controllers/rental");

const router = express.Router();

//모든책 목록 불러오는 API 25개씩
router.route("/").get(getAllboojk);
//책한권빌리기
router.route("/getRentalboojk").post(auth, getRentalboojk);
//my rental book list a
router.route("/getMyRentalboojk").get(auth, getMyRentalboojk);
//return book
router.route("/getReturnboojk").delete(auth, getReturnboojk);

module.exports = router;
