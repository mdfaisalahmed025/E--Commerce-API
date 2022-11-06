const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type:String,
      min: 1,
      max: 5,
      required: [true, `please provide rating`],
    },

    title: {
      type: String,
      trim: true,
      required: [true, `please provide title`],
      maxlength: 100,
    },

    comment: {
      type: String,
      required: [true, `please provide review text`],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.CalculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.CalculateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.CalculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
