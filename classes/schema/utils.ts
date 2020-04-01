import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let utilsSchema = new Schema({
    about: { type: String }, 
    data: { type: Object },
},	{	collection: 'utils' });

module.exports = mongoose.model( 'util', utilsSchema );