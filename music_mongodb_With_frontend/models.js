const mongoose = require('mongoose');

const songSchema = mongoose.Schema(
    {
        Songname: String,
        Film: String,
        Music_director: String,
        singer: String,
        actor: String,
        actress: String,
        favourite: Boolean
    }, {
        timestamps: true,
    }
);

module.exports = mongoose.model("Song", songSchema);