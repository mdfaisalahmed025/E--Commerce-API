const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {createTokenUser,attachedCookiesToResponse, checkPermission} = require('../utils')


//get all user
const getAllusers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

//get single user
const getSingleuser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(
      `no user with this id: ${req.params.id}`
    );
  }

  checkPermission(req.user, user._id)
  res.status(StatusCodes.OK).json({ user });
};

///show current user
const showCurrentuser = async (req, res) => {
  res.status(StatusCodes.OK).json({user: req.user})
};

//update user with user.save()
const updateUser = async (req, res) => {
  const {email,name} =req.body;
  if(!email || !name){
    throw new CustomError.BadRequestError(`please provide all the values`)
  }

  const user = await User.findOne({_id: req.user.userId});

  user.email =email;
  user.name =name;
  await user.save()

  const tokenUser =createTokenUser(user)
  attachedCookiesToResponse({res, user: tokenUser})
  res.status(StatusCodes.OK).json({user:tokenUser})
};


//update userpassword
const updateuserPassword = async (req, res) => {
  const {oldPassword, newPassword} =req.body;
  if(!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(`please provide both value`)
  }

  const user = await User.findOne({_id: req.user.userId })
  const isPasswordCorrect =await user.comparePassword(oldPassword)
  if(!isPasswordCorrect){
    throw new CustomError.UnauthenticatedError('the password is not match! or invalid credentials')
  }
  user.password =newPassword;

  await user.save()
  res.status(StatusCodes.OK).json({msg: `success! password updated`})

};

module.exports = {
  getAllusers,
  getSingleuser,
  showCurrentuser,
  updateUser,
  updateuserPassword,
};



// //update user with findoneandupdate
// const updateUser = async (req, res) => {
//   const {email,name} =req.body;
//   if(!email || !name){
//     throw new CustomError.BadRequestError(`please provide all the values`)
//   }
//   const user = await User.findOneAndUpdate(
//     {_id:req.user.userId},
//     {email,name},
//     {new:true, runValidators:true}
//   );
//   const tokenUser =createTokenUser(user)
//   attachedCookiesToResponse({res, user: tokenUser})
//   res.status(StatusCodes.OK).json({user:tokenUser})
// };