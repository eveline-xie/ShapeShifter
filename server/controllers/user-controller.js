const auth = require('../auth')
const User = require("../models/user-model.js");
const bcrypt = require("bcryptjs");

async function signup(req, res) {
  //firstName, lastName, username, email, passwordHash
   const { firstName, lastName, username, email, password, passwordVerify } =
     req.body;
  // Find existing user
  console.log("signup here!!!"+firstName)
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

      res.status(400).send(JSON.stringify({ error: true, message: "user exists" }));
    } else {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
      await User.create({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        passwordHash: passwordHash,
      });
      res.send(JSON.stringify({ message: "Success" }));
    }
  });
}

module.exports = {
  signup
};