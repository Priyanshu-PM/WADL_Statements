const mongoose = require('mongoose');

const songDetailSchema = new mongoose.Schema({
    Songname: String,
    Film: String,
    Music_Director: String,
    Singer: String,
    Actor: String,
    Actress: String
});

//  creating defination of song detail schema and exporting
const songDetails = mongoose.model("songdetails", songDetailSchema);
module.exports = songDetails;