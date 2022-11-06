const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizepermission,
} = require("../middleware/authentication");

const {
  getAllusers,
  getSingleuser,
  showCurrentuser,
  updateUser,  
  updateuserPassword,
} = require("../controllers/userController");

router
  .route("/")
  .get(authenticateUser, authorizepermission("admin"), getAllusers);
router.route("/showMe").get(authenticateUser,showCurrentuser);
router.route("/updateUser").patch(authenticateUser,updateUser);
router.route("/updateuserPassword").patch(authenticateUser,updateuserPassword);
router.route("/:id").get(authenticateUser, getSingleuser);

module.exports = router;
