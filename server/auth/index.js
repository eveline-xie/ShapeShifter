const jwt = require("jsonwebtoken");

function authManager() {
  verify = function (req, res, next) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          loggedIn: false,
          user: null,
          errorMessage: "Unauthorized",
        });
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = verified.userId;

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        errorMessage: "Unauthorized",
      });
    }
  };

  verifyUser = (req) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return null;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken.userId;
    } catch (err) {
        return null;
    }
}

  signToken = function (user) {
    return jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET
    );
  };

  return this;
}

const auth = authManager();
module.exports = auth;
