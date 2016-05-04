/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

		login: function(req,res){
			User.findOne({
				email: req.param('email')
			},function foundUser(err,user){
					if(err) return res.negotiate(err);
					if(!user) return res.notFound();

					require('machinepack-passwords').checkPassword({
						passwordAttempt:req.param('password'),
						encryptedPassword:user.encryptedPassword
					}).exec({
							error:function(err){
								return res.negotiate(err);
							},

							incorrect: function() {
								return res.notFound();
							},

							success: function() {
								req.session.me = user.id;
								return res.ok();
							}
					})

			})
		},

		signup: function(req, res) {
		var Passwords = require('machinepack-passwords');
		// Encrypt a string using the BCrypt algorithm.
		Passwords.encryptPassword({
			password: req.param('password'),
			difficulty: 10,
		}).exec({
			// An unexpected error occurred.
			error: function(err) {
				return res.negotiate(err);
			},
			// OK.
			success: function(encryptedPassword) {
				require('machinepack-gravatar').getImageUrl({
					emailAddress: req.param('email')
				}).exec({
					error: function(err) {
						return res.negotiate(err);
					},
					success: function(gravatarUrl) {
					// Create a User with the params sent from
					// the sign-up form --> signup.ejs
						User.create({
							name: req.param('name'),
							title: req.param('title'),
							email: req.param('email'),
							encryptedPassword: encryptedPassword,
							lastLoggedIn: new Date(),
							gravatarUrl: gravatarUrl
						}, function userCreated(err, newUser) {
							if (err) {

								console.log("err: ", err);
								console.log("err.invalidAttributes: ", err.invalidAttributes)
								if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
									&& err.invalidAttributes.email[0].rule === 'unique') {
									return res.emailAddressInUse();
								}
								return res.negotiate(err);
							}
							// Log user in
							req.session.me = newUser.id;
							// Send back the id of the new user
							return res.json({
								id: newUser.id
							});
						});
					}
				});
			}
		});
	},

	logout: function(req,res){
		User.findOne(req.session.me,function(err,user){

			if(err) {
				return res.negotiate(err);
			}
			if(!user){
				sails.logs.verbose('Session refers to a user who longer exists');
				return res.backToHomePage();
			}

			req.session.me = null;
			return res.backToHomePage();

		})
	}

};
