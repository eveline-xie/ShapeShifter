const auth = require("../auth");
const User = require("../models/user-model.js");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

async function getLoggedIn(req, res) {
  try {
    auth.verify(req, res, async function () {
      console.log("id", req.userId);
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
          .send(JSON.stringify({ error: true, errorMessage: "user exists" }));
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
        res.send(
          JSON.stringify({
            message: "Success",
            user: {
              firstName: firstName,
              lastName: lastName,
              username: username,
              email: email,
            },
          })
        );
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
      console.log("error: cannot find user")
      return res.status(400).json({ errorMessage: "Can not find user" });
    }
    const passwordCorrect = await bcrypt.compare(
      password,
      savedUser.passwordHash
    );
    if (!passwordCorrect) {
      console.log("error: Wrong username or password");
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
    if (email === "") {
      res.status(400).json({ errorMessage: "email required" });
    }
    await User.findOne({
      email: email,
    }).then((user) => {
      if (!user) {
        res.status(400).json({ errorMessage: "Can not find user" });
      } else {
        console.log("found user");
        //send pw recovery email
        // const token = crypto.randomBytes(20).toString("hex");
        const token = Math.random().toString(16).substring(2, 10);
        console.log("token is : "+token)
        user.resetPasswordToken = token;
        (user.resetPasswordExpires = Date.now() + 3600000), user.save();
        sendRecoveryEmail(email, token);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

function sendRecoveryEmail(email, token) {
  console.log("sending email: "+email+", "+token);
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: "shapeshifter416@outlook.com",
    to: `${email}`,
    subject: "Reset Password Verification Code",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Your verification code is:\n\n" +
      token +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };
  console.log("sending mail");

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.error("there was an error: ", err);
    } else {
      console.log("here is the res: ", response);
      res.status(200).json("recovery email sent");
    }
  });
}

async function verifyPassword(req, res) {
  const { email, token } = req.query;
  console.log(email+", "+token+ ": verify code")
  await User.findOne({
    $and: [
      { resetPasswordToken: token },
      {
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      },
    ],
  }).then(async (user) => {
    // no user
    console.log("user code verified: "+user);
    if (!user) {
      res
        .status(400)
        .json({ errorMessage: "Password code incorrect" });
    } else {
      res.status(200).send({
        success: true,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          password: user.password,
        },
      });
    }
  });
}

async function updatePassword(req, res) {
  const { username, password } = req.body;
  console.log("update password for "+username)
  await User.findOne({
    username: username,
  }).then(async (user) => {
    // no user
    console.log("reset pw user: " + user);
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

async function getUserByEmail(req, res){
  try {
    const { email} = req.query;
    const savedUser = await User.findOne({
      email: email,
    });
    if (!savedUser) {
      console.log("error: cannot find user");
      return res.status(200).json({ success: false });
    }
    else{
      sendCollaboratorEmail(email);
      return res
        .status(200)
        .json({
          success: true,})
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

function sendCollaboratorEmail(email) {
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: "WeAreShapeShifter@outlook.com",
    to: `${email}`,
    subject: "Map Shared With You",
    text: "Someone has invited you to edit the map",
  };
  console.log("sending mail");

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.error("there was an error: ", err);
    } else {
      console.log("here is the res: ", response);
      res.status(200).json("recovery email sent");
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
  verifyPassword,
  updatePassword,
  getUserByEmail,
  logout,
};
