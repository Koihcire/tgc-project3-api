const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const helpers = require('handlebars-helpers')({
  handlebars: hbs.handlebars
});
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const { checkIfAuthenticated, checkIfAuthenticatedJWT} = require('./middlewares')
const csrf = require('csurf')
const cors = require('cors')

// create an instance of express app
const app = express();

// enable cors before sessions
app.use(cors());

// set up sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// set the view engine
app.set("view engine", "hbs");

// share sessions user data
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
})

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// set up partials
hbs.registerPartials('./views/partials');

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(flash());
//setup a middleware
app.use(function (req, res, next) {
  //res.locals will contain all variables available to hbs files
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

//enable csruf protection
// app.use(csrf());
const csrfInstance = csrf();
app.use(function (req, res, next) {
    // console.log("checking for csrf exclusion")
    // exclude whatever url we want from CSRF protection
    if (req.url === "/checkout/process_payment" || req.url.slice(0,5) == '/api/'){
        console.log("detected")
        next();
    } else {
        csrfInstance(req, res, next);
    }
})
app.use(function (req, res, next) {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

//ROUTES
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cloudinaryRoutes = require('./routes/cloudinary');
const userRoutes = require('./routes/users')
const api = {
  products: require('./routes/api/products'),
  cart: require('./routes/api/cart'),
  customers: require('./routes/api/customers'),
  checkout: require('./routes/api/checkout'),
  stripe: require('./routes/api/stripe'),
  orders: require('./routes/api/orders'),
  test_checkout: require('./routes/api/test-checkout')
}


async function main() {
    app.use('/', landingRoutes);
    app.use('/products',checkIfAuthenticated ,productRoutes);
    app.use('/orders',checkIfAuthenticated,orderRoutes);
    app.use('/cloudinary',checkIfAuthenticated,cloudinaryRoutes);
    app.use('/users', userRoutes);
    app.use('/api/products', express.json(), api.products);
    app.use('/api/cart', express.json(), checkIfAuthenticatedJWT, api.cart);
    app.use('/api/customers', express.json(), api.customers);
    app.use('/api/checkout', checkIfAuthenticatedJWT, api.checkout);
    app.use('/api/stripe', api.stripe);
    app.use('/api/orders', express.json(), checkIfAuthenticatedJWT, api.orders)
    app.use('/api/test-checkout', api.test_checkout)
}

main();

app.listen(process.env.PORT, () => {
  console.log("Server started");
});