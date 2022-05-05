const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const exhibitionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, {timestamps: true});
exhibitionSchema.plugin(AutoIncrement, {inc_field: 'exhibitionId'});
const Exhibition = mongoose.model('exhibitions', exhibitionSchema);
module.exports = Exhibition;