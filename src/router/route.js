//router

const express = require('express')
const router=new express.Router()
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true })); 

const conn = require('../db/database');

const booking = require("../model/command");



//end points

router.post('/book', booking.create);
router.get('/book/',booking.findall);
router.put("/book/:id", booking.update);
router.get('/book/:id',booking.findone);
router.delete('/book/:id',booking.deleteone);









module.exports=router;