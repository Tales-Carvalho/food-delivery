const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/food_delivery', {useNewUrlParser: true, useUnifiedTopology: true});

const menuSchema = new mongoose.Schema({
    FoodList: [{ Name: String }],
    DayWeek: Number,
    Price: Number
}, { collection: 'menus' });

const drinksSchema = new mongoose.Schema({
    Name: String,
    Price: Number
}, { collection: 'drinks' });

const dessertsSchema = new mongoose.Schema({
    Name: String,
    Price: Number
}, { collection: 'desserts' });

const ordersSchema = new mongoose.Schema({
    Client: String,
    Meals: [{ FoodList: [{ Name: String }], Price: Number, Quantity: Number }],
    Drinks: [{ Name: String, Price: Number, Quantity: Number }],
    Desserts: [{ Name: String, Price: Number, Quantity: Number }],
    Delivered: Boolean,
    Date: Date,
    Price: Number
}, { collection: 'orders' })

module.exports = { Mongoose: mongoose, MenuSchema: menuSchema, DrinksSchema: drinksSchema, DessertsSchema: dessertsSchema, OrdersSchema: ordersSchema }