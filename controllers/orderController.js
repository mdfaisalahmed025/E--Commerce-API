///Import model
const Order = require("../models/Order");
const Product = require("../models/product");

//status code, error, permission
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermissions = require("../utils/checkPermission");

const FakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'somerandomvalue';
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError(`No cart items provided`);
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      `please provide tax and shipping fee`
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with this id : ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;
    console.log(name, price, image);

    const SingleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    //add item to the order
    orderItems = [...orderItems, SingleOrderItem];
    //calculate subtotal
    subtotal += item.amount * price;
  }

  //calculate total amount
  const total = tax + shippingFee + subtotal;
  //get client secret

  const paymentIntent = await FakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret});
};

const getAllOrders = async (req, res) => {
 const orders = await Order.find({})
 res.status(StatusCodes.OK).json({orders, count: orders.length})
};
const getSingleOrder = async (req, res) => {
  const {id:orderId} =req.params;
  const order = await Order.findOne({_id:orderId})
  if(!order){
    throw new CustomError.NotFoundError(`No product with this id: ${orderId}`)
  }
  checkPermissions(req.user, order.user)
  res.status(StatusCodes.OK).json({order})
};

const getCurrentUserOrder = async (req, res) => {
  const orders = await Order.find({user:req.user.userId})
  res.status(StatusCodes.OK).json({orders, count: orders.length})
};

const UpdateOrder = async (req, res) => {
  const{id:orderId}=req.params;
  const{paymentIntent} = req.body;

  const order = await Order.findOne({_id:orderId})
  if(!order){
    throw new CustomError.NotFoundError(`No order found with this id : ${orderId}`)
  }

  checkPermissions(req.user, order.user);
  order.paymentIntent =paymentIntent
  order.status = 'paid'
  await order.save()
  res.status(StatusCodes.OK).json({order})
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  UpdateOrder,
};
