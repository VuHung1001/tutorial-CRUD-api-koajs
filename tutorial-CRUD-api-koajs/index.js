const koa = require('koa');
const router = require('koa-router');
const bodyParser = require('koa-body');

const app = new koa();

//Set up body parsing middleware
app.use(bodyParser({
   formidable:{uploadDir: './uploads'},
   multipart: true,
   urlencoded: true
}));

//Require the Router we defined in movies.js
const movies = require('./modules/movies.js');

//Use the Router on the sub route /movies
app.use(movies.routes());

app.listen(3000, ()=> console.log('Server running on port '+3000));