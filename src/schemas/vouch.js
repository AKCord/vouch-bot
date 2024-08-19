const { Schema, model } = require("mongoose");

const vouchSchema = new Schema({
	userId: String,
	date: Date,
	optMessage: String,
	product: String,
	review: String,
	id: String,
});

module.exports = model("vouches", vouchSchema);
