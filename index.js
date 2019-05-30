const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const edge = require("edge.js");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require("connect-flash");

const Post = require('./database/models/Post');
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const auth = require("./middleware/auth");
const storePost = require('./middleware/storePost')
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')	
const logoutController = require("./controllers/logout");


 
const app = new express();
app.use(expressSession({
    secret: 'secret'
}));
app.use(connectFlash());
mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))
    app.use(fileUpload());
    const mongoStore = connectMongo(expressSession);
    app.use(expressSession({
        secret: 'secret',
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        })
    }));
app.use(express.static('public'));
app.use(expressEdge);
app.set('views', __dirname + '/views');
app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/posts/store', storePost)
/* app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/index.html'));
}); */
/* app.get('/', (req, res) => {
    res.render('index');
}); */
/* app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
}); */
app.get("/", homePageController);
/* app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
}); */
app.get("/post/:id", getPostController);
/* app.get('/posts/new', (req, res) => {
    res.render('create');
}); */
//app.get("/posts/new", createPostController);
app.get("/posts/new", auth, createPostController);
/* app.post("/posts/store", (req, res) => {
    const {
        image
    } = req.files
 
    image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            res.redirect('/');
        });
    })
}); */
app.post("/posts/store", storePostController);
app.get("/auth/register", createUserController);
app.post("/users/register", storeUserController);
app.get('/auth/login', loginController);
app.post('/users/login', loginUserController);
app.get("/auth/logout", redirectIfAuthenticated, logoutController);
/* app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/about.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
});
 
app.get('/post', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/post.html'));
}); */

app.get('/about', (req, res) => {
    res.render('about');
});
 
app.get('/contact', (req, res) => {
    res.render('contact');
});
 

app.listen(3000, () => {
    console.log('App listening on port 3000')
});