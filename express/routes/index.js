var express = require('express');
var multer  = require('multer');
var md5 = require('md5');
var jwt = require('jwt-simple');
var Post = require('../models/posts');
var Users = require('../models/users');
var router = express.Router();
var name_img="";
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb){
        var name=new Date().getTime();
        var str=file.originalname;
        var img = str.split(".");
        name_img=name+"."+img[img.length - 1];
        cb(null, name_img);
    }
});
var upload = multer({storage: storage});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/login', function(req, res, next) {
    Users.find({user_name: req.body.user_name, password: req.body.password}, function(err, user){
        if (user.length == 1){
            console.log(user[0]);
          var info_user={id: user[0]._id};
          var secret = 'string';
          var token = jwt.encode(info_user, secret);
            user[0].jwt=token;
            user[0].save(function(err){
                res.json({mes:"ok",jwt: user[0].jwt});
            });
        }else {
            res.json({mes: "erro"});
        }

    });
});
router.post('/new_user',upload.single('avata'), function(req, res, next) {
    Users.create({
        user_name: req.body.user_name,
        full_name: req.body.full_name,
        password: req.body.password,
        flowing: [],
        link_avata: name_img,
        jwt: "",
    }, function(err){
        if(!err){
            res.json({message: 'created successfully'});
        } else {
            res.json({message: 'Error creating'});
        }
    });
});

router.post('/new_post',upload.single('feature'), function(req, res, next) {
    Post.create({
        id_user: req.body.id_user,
        content: req.body.content,
        comment: [],
        likes: [],
        link_img: name_img,
        add_date: Date.now(),
        updated: Date.now()
    }, function(err){
        if(!err){
            res.json({message: 'created successfully'});
        } else {
            res.json({message: 'Error creating'});
        }
    });
});
router.put("/edit_post/:id", upload.single('feature'), function(req, res){
    Post.findById(req.params.id, function(err, post){
        post.content = req.body.content;
        post.updated = ""+Date.now();
        if(req.file){
            fs.unlink('public/uploads/' +post.link_img, function(err3){
            });
            post.link_img = name_img;
        }
        post.save(function(err){
            res.json({post: post});
        });
    });
});
router.delete("/delete_post/:id", function(req, res){
    Post.findById(req.params.id, function(err, post){
        console.log(post.link_img);
        if(err){
            res.json({message: "Post was not found", error: error});
        } else {
            fs.unlink('public/uploads/' + post.link_img, function(err3){
            });
            post.remove(function(err2){
                if(err2){
                    res.json({message: "Error deleting post", error: error});
                }else {
                    res.json({message: 'Success'});
                }
            });
        }
    });
});
router.get('/likepost/id_post/:id_post/id_user/:id_user', function(req, res, next) {
    Post.findById(req.params.id_post, function(err, post){
        if (post.likes.indexOf(req.params.id_user) > -1){
            post.likes.splice(post.likes.indexOf(req.params.id_user),1);
        }else {
            post.likes.push(req.params.id_user);
        }
        post.save(function(err){
            res.json({likes: post.likes});
        });
    });
});
router.get('/id_user=:id_user', function(req, res, next) {
    var id= req.params.id_user;
    Post.find({id_user: id},function (err, posts) {
        res.json({post: posts, id: id});
    });
});
router.get('/post/:id', function(req, res, next) {
    Post.find({_id: req.params.id},function (err, posts) {
        res.json({post: posts});
    });
});
router.get('/index', function(req, res, next) {
    Post.find({},function (err, posts) {
        res.json({post: posts});
    });
});
module.exports = router;
