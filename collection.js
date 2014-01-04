var mongoose = require('mongoose');

var financeSchema = mongoose.Schema({
	item: String,
	amount: Number,
	payment: String,
	addDate: Date
	});
module.exports = mongoose.model('Finance',financeSchema, 'moneyrecord');