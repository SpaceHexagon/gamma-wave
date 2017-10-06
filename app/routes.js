var Media = require('./models/media');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	app.get('/api/media', function(req, res) {
		
		Media.find(function(err, files) {

			// if there is an error retrieving, send the error. 
							// nothing after res.send(err) will execute
			if (err)
				res.send(err);

			res.json(files); // return all nerds in JSON format
		});
	});

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};