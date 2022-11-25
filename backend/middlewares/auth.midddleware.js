const userModel = require('../apis/v1/user/user.model');
const service = require('../services/jwtHelper.services');


module.exports = {

  validate: async (req, res, next) => {
    //get the token from the header if present
    try {
      console.log("auth" , req.headers)
      let token = req.headers['x-access-token'] || req.headers['authorization'];
      //if no token found, return response (without going to the next middelware)
      if (!token) return res.status(401).json({ remarks: "Access denied. No token provided." });
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        //console.log(token)
        const decoded = await service.verifyToken(token);
        //console.log(decoded.id);
        //if can verify the token, set req.user and pass to next middleware
        let result = await userModel.findOne({ _id: decoded.id }, { 'reset_expiry': 0 });

        if (result && result._id) {
          //console.log(result)
          req.user = result;
          return next();
        }

      }
      return res.status(401).json({ remarks: "Invalid token." });
    } catch (ex) {
      //if invalid token
      console.log('inside catch')
      return res.status(401).json({ remarks: "Invalid token." });
    }
  },
} 
