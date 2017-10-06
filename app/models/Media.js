var mongoose = require('mongoose');

// define media model
module.exports = mongoose.model('Media', {
	name : {type : String, default: ''},
	type : {type : String, default: 'video'}
});
