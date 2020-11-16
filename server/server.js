const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
const port = 3000; // Default port
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add headers to allow access from port 4200
app.use( function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Defining routes
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Server working.' }));
app.use('/', router); // Requests to root must be treated by the router

// Initialize the server
app.listen(port);
console.log('Server initialized.');

// If DB doesn't exist, create it with default values from initial_data.json.
checkMenuSize();

function checkMenuSize() {

    const Menus = db.Mongoose.model('menus', db.MenuSchema, 'menus');
    Menus.countDocuments({}).lean().exec(
        function (err, num) {
            if (num == 0) {
                generateInitialData();
            }
        }
    );

}


function generateInitialData() {

    console.log("Generating initial data.")

    const Menus = db.Mongoose.model('menus', db.MenuSchema, 'menus');
    const Drinks = db.Mongoose.model('drinks', db.DrinksSchema, 'drinks');
    const Desserts = db.Mongoose.model('desserts', db.DessertsSchema, 'desserts');
    
    const rawdata = fs.readFileSync('initial_data.json');
    const data = JSON.parse(rawdata);

    for (let i = 0; i < data.Menus.length; i++) {
        const menu = new Menus(data.Menus[i]);
        menu.save( function (err, docs) { if(err) console.log(err); } );
    }

    for (let i = 0; i < data.Drinks.length; i++) {
        const drink = new Drinks(data.Drinks[i]);
        drink.save( function (err, docs) { if(err) console.log(err); } );
    }

    for (let i = 0; i < data.Desserts.length; i++) {
        const dessert = new Desserts(data.Desserts[i]);
        dessert.save( function (err, docs) { if(err) console.log(err); } );
    }

}


function returnJson(err, docs, res) {
    if (err) {
        console.log("Error: " + err.message);
        res.json(err);
    }
    else {
        res.json(docs);
    }
}


router.get('/menu', (req, res) => {

    console.log('GET request: /menu');

    function returnAll(err, docs) {
        // This is only run once all variables are defined
        if (returnDrinks && returnDesserts && returnMenus) {
            const returnAll = { Drinks: returnDrinks, Desserts: returnDesserts, Menu: returnMenus };
            returnJson(err, returnAll, res);
        }
    }
    
    const date = new Date;
    const day_week = date.getDay();
    let returnDrinks, returnDesserts, returnMenus;

    const Drinks = db.Mongoose.model('drinks', db.DrinksSchema, 'drinks');
    Drinks.find({}).lean().exec(
        function (err, docs) {
            returnDrinks = docs;
            returnAll(err, docs);
        }
    );

    const Desserts = db.Mongoose.model('desserts', db.DessertsSchema, 'desserts');
    Desserts.find({}).lean().exec(
        function (err, docs) {
            returnDesserts = docs;
            returnAll(err, docs);
        }
    );

    const Menus = db.Mongoose.model('menus', db.MenuSchema, 'menus');
    Menus.find({ DayWeek: day_week }).lean().exec(
        function (err, docs) {
            returnMenus = docs;
            returnAll(err, docs);
        }
    );

});


router.post('/order', (req, res) => {

    console.log('POST request: /order');

    const Orders = db.Mongoose.model('orders', db.OrdersSchema, 'orders');
    const order = new Orders({
        Client: req.body.Client,
        Meals: req.body.Meals,
        Drinks: req.body.Drinks,
        Desserts: req.body.Desserts,
        Delivered: req.body.Delivered,
        Date: req.body.Date
    });

    order.save( function (err, docs) { returnJson(err, docs, res); } );

});


router.get('/order', (req, res) => {

    console.log('GET request: /order');

    const curr_date = new Date;
    const today = new Date(curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate(), 0, 0, 0, 0);

    const Orders = db.Mongoose.model('orders', db.OrdersSchema, 'orders');
    Orders.find({ Date: { $gte: today } }).lean().exec(
        function (err, docs) { returnJson(err, docs, res); }
    );

});


router.patch('/order', (req, res) => {

    console.log('PATCH request: /order');
    
    const Orders = db.Mongoose.model('orders', db.OrdersSchema, 'orders');
    Orders.updateOne({ _id: req.body.id }, { Delivered: req.body.Delivered }).lean().exec(
        function (err, docs) { returnJson(err, docs, res); }
    );

});