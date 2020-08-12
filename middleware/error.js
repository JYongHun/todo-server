// 에러가 발생하면, 얘가 전담 처리한다.
// 이 에러 핸들러가 직접, 클라이언트에 에러를 리스판스!
const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};

module.exports = errorHandler;
