
const express =require('express')
const router =express.Router()

const {authenticateUser, authorizepermission} =require('../middleware/authentication')


const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  UpdateOrder,
} = require("../controllers/orderController");

router
.route('/')
.post(authenticateUser,createOrder)
.get(authenticateUser, authorizepermission('admin'), getAllOrders)


router
.route('/showAllMyOrders')
.get(authenticateUser, getCurrentUserOrder)

router
.route('/:id')
.get(authenticateUser,getSingleOrder)
.patch(authenticateUser,UpdateOrder)

module.exports =router;
