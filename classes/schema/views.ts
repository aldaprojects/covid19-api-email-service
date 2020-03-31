import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let viewsSchema = new Schema({
    about: { type: String, default: 'covidpage' }, 
    views: { type: Number, default: 0 },
},	{	collection: 'views' });

module.exports = mongoose.model( 'view', viewsSchema );