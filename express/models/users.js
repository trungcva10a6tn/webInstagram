var mongoose = require('mongoose');
var users = mongoose.Schema;
var Users = new users({
    user_name: String,
    full_name: String,
    password: String,
    link_avata: String,
    flowing: [],
    jwt: String
},{collection: "users"});
module.exports = mongoose.model('Users', Users);