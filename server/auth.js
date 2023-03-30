const User = require('./models/user-model.js')

async function signup(firstName, lastName, username, email, passwordHash, res) {
    // Find existing user
    await User.findOne({$or: [
        {username:username},
        {email: email}
    ]}).then( async (user) => {
 
            await User.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                passwordHash: passwordHash,
               
                
            })
           
       
        
    })
}

module.exports = { signup}