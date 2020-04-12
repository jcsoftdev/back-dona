const mongoose = require('mongoose');

//USER MODEL

const UserSchema = mongoose.Schema({
    name: String,
    dni: Number,
    cellphone: Number,
    location:  {
        lat: Number,
        lng: Number
    },
    products: [
        {
            productName: String,
            description: String,
            state: {
                type: Boolean,
                default: false
            }
        },
    ]
});

module.exports = mongoose.model('Users', UserSchema)
