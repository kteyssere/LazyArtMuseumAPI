const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});
userSchema.plugin(AutoIncrement, {inc_field: 'userId'});
const User = mongoose.model('user', userSchema);
module.exports = User;