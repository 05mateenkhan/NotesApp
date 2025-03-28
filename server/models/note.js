const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }

});
module.exports = mongoose.model('Note',noteSchema);

// userModel.count({}, function( err, count){
//     console.log( "Number of users:", count );
// })
