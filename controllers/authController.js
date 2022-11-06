const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachedCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new CustomError.BadRequestError(`Email Already Exists`);
  }
  //first registerd user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(user)
  attachedCookiesToResponse({res, user:tokenUser})
  res.status(StatusCodes.CREATED).json({ user: tokenUser });

};

const login = async (req, res) => {

  //check for email 
  const {email, password} =req.body;
  if(!email || !password){
    throw new CustomError.BadRequestError('please Provide email and Password')
  }
  //check for user
  const user = await User.findOne({email})
  if(!user){
    throw new CustomError.UnauthenticatedError(`No user is found`)
  }

  //check is password match

  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect){
    throw new CustomError.UnauthenticatedError('password is not correct')
  }

   const tokenUser = { name: user.name, userId: user._id, role: user.role };
   attachedCookiesToResponse({ res, user: tokenUser });
   res.status(StatusCodes.OK).json({ user: tokenUser });


};

const logout = async (req, res) => {
  
  res.cookie('token', 'logout',{
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  })

  res.status(StatusCodes.OK).json({msg: `user logged out!`})




};

module.exports = {
  register,
  login,
  logout,
};
