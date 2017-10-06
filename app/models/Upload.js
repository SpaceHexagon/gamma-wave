var mongoose = require('mongoose');

// define upload model
module.exports = mongoose.model('Upload', {
	name : {type : String, default: ''},
    type : {type : String, default: 'video'},
    author: {type : String, default: 'anonymous'},
    private: {type: Boolean, default: false }
});
