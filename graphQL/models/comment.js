const mongoose = require('mongoose');


const Comment = new mongoose.Schema({
    text: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: String,
    mentions: [String]

});

export default Comment;