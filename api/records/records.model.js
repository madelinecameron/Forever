'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var recordSchema = new Schema({
    name : { type: String, required: true },
    description : { type: String, required: false },
    price : { type: Number, required: true },
    date_added : { type: Date, required: true },
    category : { type: Number, required: true },
    loc: { type: [Number], required: true, index: '2dsphere' }, //https://github.com/LearnBoost/mongoose/wiki/3.6-
                                                                // Release-Notes#geojson-support-mongodb--24
    owner_id : { type: String, required: true }
});

itemSchema.index({"loc" : "2dsphere"});

module.exports = mongoose.model('records', recordSchema);
