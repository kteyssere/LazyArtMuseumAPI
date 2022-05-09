const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        required: true
    }
}, {timestamps: true, collection: 'users'});
userSchema.plugin(AutoIncrement, {inc_field: 'userId'});
const User = mongoose.model('users', userSchema);
module.exports = User;