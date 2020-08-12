// Error 클래스는, nodejs의 express 패키지에 들어있는
// 클래스다. 이를 상속하여, 우리는 에러 처리 가능!
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
