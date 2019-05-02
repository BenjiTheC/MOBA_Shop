function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return false;
  } else {
    return true;
  }
}

function myLogger(req, res, next) {
  console.log(`[${new Date().toUTCString()}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = {
  isLoggedIn,
  myLogger
};
