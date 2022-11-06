const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizepermission,
} = require("../middleware/authentication");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  UpdateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const {getSingleProductReviews} =require('../controllers/reviewController')

router
  .route("/")
  .post([authenticateUser, authorizepermission("admin"), createProduct])
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizepermission("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizepermission("admin")], UpdateProduct)
  .delete([authenticateUser, authorizepermission("admin")], deleteProduct);

  router.route('/:id/reviews').get(getSingleProductReviews)

module.exports = router;
