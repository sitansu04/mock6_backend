const mongoose = require("mongoose");
require('dotenv').config();
const connection = mongoose.connect("mongodb+srv://sitansumandal:smandal@cluster0.tobgf4t.mongodb.net/mocksix?retryWrites=true&w=majority");

module.exports = {
  connection,
};
