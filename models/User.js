const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Please Provide your name`],
    maxlength: 50,
    minlength: 3,
  },

  email: {
    type: String,
    unique:true,
    required: [true, `Please Provide your valid email`],
    validate: {
      validator: validator.isEmail,
      message: `please provide valid email`,
    },
  },

  password: {
    type: String,
    required: [true, `Please Provide your valid email`],
  },

  role: {
    type:String,
    enum: ["admin", "user"],
    default: "user",
  },

})

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));

  if(!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword =async function(candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch;
}

 

  //   email: {
  //     type: String,
  //     required: [true, `please provide your valid email address`],
  //     match: [
  //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  //       "Please provide a valid email",
  //     ],
  //     unique:true,
  //   },

 

module.exports = mongoose.model("User", UserSchema);
