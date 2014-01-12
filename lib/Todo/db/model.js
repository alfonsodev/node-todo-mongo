var mongoose = require('mongoose');
var schema = mongoose.Schema({
		user_id: Number,
		title: String,
		body: String
}, { collection: 'tasks', autoindex: false });

module.exports = mongoose.model('tasks', schema, 'tasks');
