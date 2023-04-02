const User = require('./models/user-model.js')

async function signup(firstName, lastName, username, email, passwordHash, res) {
    // Find existing user
    await User.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    }).then(async (user) => {
        if (user) {
            res.send(JSON.stringify({ error: true, message: "user exists" }));
        } else {
            await User.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                passwordHash: passwordHash,
            })
            res.send(JSON.stringify({ message: "Success" }));
        }
    })
}

async function login(email, password, req, res) {
    await User.findOne({
        $and: [
            { email: email },
            { passwordHash: password },
        ]
    }).then((user) => {
        // Incorrect login
        console.log("login user: " + user);
        if (!user) {
            res.send(JSON.stringify({ error: true, message: "Can not find user" }));
        }
        else {
            console.log("logged in!!!")
            res.send(JSON.stringify({ message: "Success" }));

        }
    })
}

async function rememberPassword(email, username, req, res) {
    await User.findOne({
        $and: [
            { email: email },
            { username: username },
        ]
    }).then((user) => {
        // no user
        console.log("remember user: " + user);
        if (!user) {
            res.send(JSON.stringify({ error: true, message: "Can not find user" }));
        }
        else {
            console.log("found user")
            res.send(JSON.stringify({ password: user.passwordHash }));

        }
    })
}

async function changePassword(username, password, newPassword, req, res) {
    await User.findOne({
        $and: [
            { username: username },
            { passwordHash: password }
        ]
    }).then((user) => {
        // no user
        console.log("change user: " + user);
        if (!user) {
            res.send(JSON.stringify({ error: true, message: "Can not find user" }));
        }
        else {
            console.log("found user")
            user.passwordHash = newPassword;
            user.save().then(() => {
                res.send(JSON.stringify({ message: "Password Updated!" }));
            }
            )
        }
    })
}

module.exports = { signup, login, rememberPassword, changePassword }