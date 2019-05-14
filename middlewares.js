function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return false;
  } else {
    return true;
  }
}

function myLogger(req, res, next) {
  const userAuth = req.session.user
    ? "[Authenticated User]"
    : "[Non-authenticated User]";
  console.log(
    `[${new Date().toUTCString()}] ${req.method} ${req.originalUrl} ${userAuth}`
  );
  next();
}

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    res.redirect("/authen/login");
  } else {
    next();
  }
}

module.exports = {
  isLoggedIn,
  myLogger,
  isAuthenticated
};
