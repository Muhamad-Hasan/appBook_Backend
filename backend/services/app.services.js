let bcrypt = require('bcryptjs');

incryptData = async (text) => {
    try {
        let result = await bcrypt.hash(text, 10);
        return result;
    } catch (error) {
        return error;
    }
}

comparePassword = async (plain_text, hash) => {
    try {
        let result = await bcrypt.compare(plain_text, hash);
        return result;
    } catch (error) {
        return error;
    }
}


module.exports = {
    comparePassword,
    incryptData,
}