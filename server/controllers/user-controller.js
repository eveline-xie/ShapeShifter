const auth = require("../auth");
const User = require("../models/user-model.js");
const bcrypt = require("bcryptjs");

async function getLoggedIn(req, res) {
  try {
    auth.verify(req, res, async function () {
      const loggedInUser = await User.findOne({ _id: req.userId });
      console.log("loggedin user: " + loggedInUser);
      return res
        .status(200)
        .json({
          loggedIn: true,
          user: {
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            email: loggedInUser.email,
            username: loggedInUser.username,
          },
        })
        .send();
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

async function signup(req, res) {
  try {
    //firstName, lastName, username, email, passwordHash
    const { firstName, lastName, username, email, password, passwordVerify } =
      req.body;
    // Find existing user
    console.log("signup here!!!" + firstName);
    if (password.length < 8) {
      console.log("<8!!!" + firstName);

      return res.status(400).json({
        errorMessage: "Please enter a password of at least 8 characters.",
      });
    }
    if (password !== passwordVerify) {
      console.log("pw!=pw!!!" + password + ", " + passwordVerify);

      return res.status(400).json({
        errorMessage: "Please enter the same password twice.",
      });
    }
    await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).then(async (user) => {
      if (user) {
        console.log("error?!!!" + firstName);

        res
          .status(400)
          .send(JSON.stringify({ error: true, message: "user exists" }));
      } else {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = await User.create({
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          passwordHash: passwordHash,
        });
        console.log(newUser);
        res.send(JSON.stringify({ message: "Success" }));
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }
    const savedUser = await User.findOne({
      username: username,
    });
    if (!savedUser) {
      return res.status(400).json({ errorMessage: "Can not find user" });
    }
    const passwordCorrect = await bcrypt.compare(
      password,
      savedUser.passwordHash
    );
    if (!passwordCorrect) {
      return res.status(401).json({
        errorMessage: "Wrong username or password.",
      });
    }
    console.log("logged in user: " + savedUser);
    const token = auth.signToken(savedUser);
    await res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        success: true,
        user: {
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          username: savedUser.username,
          password: savedUser.password,
        },
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.query;
    console.log("forgot password email: " + email);
    await User.findOne({
      email: email,
    }).then((user) => {
      if (!user) {
        res.status(400).json({ errorMessage: "Can not find user" });
      } else {
        console.log("found user");
        //send pw recovery email
        key = Math.random().toString(16).substring(2, 10);
        sendRecoveryEmail(email, key);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

function sendRecoveryEmail(email, key) {
  console.log(email);
}

async function changePassword(username, password, req, res) {
  await User.findOne({
    username: username,
  }).then(async (user) => {
    // no user
    console.log("change user: " + user);
    if (!user) {
      return res.status(400).json({ errorMessage: "Can not find user" });
    } else {
      console.log("found user");
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(password, salt);
      user.passwordHash = passwordHash;
      user.save().then(() => {
        res.send(JSON.stringify({ message: "Password Updated!" }));
      });
    }
  });
}

async function logout(req, res) {
  console.log("logout!!!");
  auth.verify(req, res, async function () {
    try {
      return res
        .clearCookie("token")
        .status(200)
        .json({
          loggedIn: false,
          user: null,
        })
        .send();
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  });
}

module.exports = {
  getLoggedIn,
  signup,
  login,
  forgotPassword,
  sendRecoveryEmail,
  changePassword,
  logout,
};
