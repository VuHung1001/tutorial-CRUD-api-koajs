const Koa = require('koa');
const KoaRouter = require('koa-router')
const json = require('koa-json')
const path = require('path')
const render = require('koa-ejs')
const bodyParser = require('koa-bodyparser')

const app = new Koa();
const router = new KoaRouter();

// Replace with DB
const things = ['My Family', 'Programming', 'Music']

// Json Prettier Middleware
app.use(json());
// BodyParser Middleware
app.use(bodyParser());

// Add additional properties to context
app.context.user = 'Hung'

// error handler
app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
})

// x-response-time
.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
})

// Simple Middleware
// .use(async ctx => {
//   ctx.body = {msg: 'Hello World'};
// });

render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false,
})

//Routes
router.get('/', index);
router.get('/add', showAdd);
router.post('/add', add);

// List of things

// index middleware
async function index(ctx){
  await ctx.render('index', {
    title: 'Things I Love:',
    things
  })
}

// showAdd middleware
async function showAdd(ctx){
  await ctx.render('add')
}

// Add thing
async function add(ctx){
  const body = ctx.request.body;
  things.push(body.thing);
  ctx.redirect('/');
}

// Index route
// router.get('/', async ctx =>{
//   await ctx.render('index', {
//     title: 'Things I Love:',
//     things
//   })
// })

router.get('/test', ctx => (ctx.body = 'Hello '+ctx.user))
router.get('/test/:name', ctx => (ctx.body = 'Hello '+ctx.params.name))

// Router Middleware
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, ()=> console.log('Server Started on Port '+3000));