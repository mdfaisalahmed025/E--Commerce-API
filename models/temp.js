

const agg = [
  {
    $match: {
      product: ObjectId("6365597cf4724be12039db4f"),
    },
  },
  {
    $group: {
      _id: "$product",
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
