const bcrypt = require('bcrypt');

const hashPassword = async (password) =>{
   return await bcrypt.hash(password, 10);
};

const comparePassword = async (rawPassword, hashedPassword)=>{
    return await bcrypt.compare(rawPassword, hashedPassword);
}
module.exports = { hashPassword, comparePassword };