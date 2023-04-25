const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "flight",
  },
});

const Bookingmodel = mongoose.model("book", bookingSchema);
module.exports = {
  Bookingmodel,
};
