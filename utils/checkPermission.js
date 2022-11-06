const customError = require("../errors");

const checkPermission = (requestUser, resourceUserId) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof reasorceUserId);

  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new customError.UnauthorizeError(`Not authorized to access this route`);
};

module.exports = checkPermission;
