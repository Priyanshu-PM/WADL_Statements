const express = require('express');
const path = require('path')
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const Song = require('./models')

const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());

const db_string = "mongodb://localhost:27017/songs";
const PORT = 5000

//  database connection
mongoose.connect(db_string).then((success)=> {
    console.log("Database connected successfully");
}).catch((error) => {
    console.log("Error in connecting database", error);
})

app.use('/css', express.static(path.resolve(__dirname, 'static/css')));

app.get('/', async (req, res) => {
    res.render('index', {music: null});
})

app.post('/addSong', async (req, res) => {
    const song = new Song(req.body);
    await song.save().then((item) => {
        res.redirect('/listSongs')
    }).catch((error) => {
        res.json({"message": "error"});
    })
})


app.get("/listSongs", async (req, res) => {
    const songs = await Song.find();
    // res.send({"songs": songs})
    res.render('index', {music: songs});
    // res.json({"message": "error"});
})


app.get("/songsByDirector/:director", async (req, res) => {
    await Song.find({Music_director: req.params.director}).
    then((music) => {
        res.render("index", {music: music});
    }).
    catch((error) => {
        res.json({"message": "error"});
    });
});

app.get("/songsByDirectorAndSinger/:director/:singer", async (req, res) => {
    await Song.find({
        Music_director: req.params.director, 
        singer: req.params.singer
    }).then((music) => {
        // res.send({"music": music});
        res.render("index", {music: music});
    }).catch((error) => {
        res.json({"message": "error"});
    })
})

app.post("/deleteSong/:id", async (req, res) => {
    Song.findByIdAndDelete(req.params.id).
    then((music) => {
        res.redirect("/listSongs");
    }).catch((error) => {
        res.json({"message": "error"});
    })
})



// Add favorite song
app.post("/markFavorite/:id", async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).send("Song not found");
    }
    song.favorite = true;
    await song.
    save()
    .then((item) => {
      res.redirect("/listFavoriteSongs");
    })
    .catch ((error) => {
      res.status(500).json({ message: "Error marking song as favorite" });
    });
});

app.get("/listFavoriteSongs", async (req, res) => {
  Song.find({ favorite: true })
  .then((favoriteSongs) => {
    res.render("favouriteSongs", { favoriteSongs: favoriteSongs });
  })
  .catch ((error) => {
    res.status(500).json({ message: "Error retrieving favorite songs" });
  });
});


app.get("/songBySingerAndFilm/:singer/:film", async (req, res) => {
    Song.find({
        singer: req.params.singer,
        Film: req.params.film
    }).
    then((music) => {
        res.send({"music": music});
        //res.render("index", {music: music});
    }).catch((error) => {
        res.json({"message": "error"});
    });
});

app.post("/updateSong/:id", async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (!song) {
        return res.status(404).send("Song not found");
    }
    song.actor = req.body.actor;
    song.actress = req.body.actress;

    await song.save().then((item) => {
        res.redirect("/listSongs");
    }).catch((error) => {
        res.status(500).json({"message": "error updating song"});
    });
});

app.listen(PORT, () => {
    console.log("Server running on port : ", PORT );
})