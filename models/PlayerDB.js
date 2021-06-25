'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var playerDBSchema = Schema( {
  first_name: String,
  last_name: String
} );

module.exports = mongoose.model( 'PlayerDB', playerDBSchema );
