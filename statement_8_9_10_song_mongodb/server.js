const express = require('express');
const mongoose = require('mongoose');
const songDetails = require("./songDetails");
const app = express();

app.use(express.json());

// a) Create a Database called music
// const db_string = "mongodb+srv://priyanshupict:gD5RFSXBLqtnUGKA@cluster0.6tw0y59.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const db_string = "mongodb://localhost:27017/music";
const port = 5000;

// b) Create a collection called song details

// c) Insert array of 5 song documents in above Collection. [Document should have 
// following field: Songname, Film, Music_director, singer]

// h) Add a new song which is your favorite.

app.post("/add", async (req, res) => {
  const { Songname, Film, Music_director, Singer } = req.body;
  const song = await songDetails.create({ Songname, Film, Music_director, Singer });
  res.send({ message: "Data Is Inserted", song });
})

// d) Display total count of documents and List all the documents in the browser.
app.get("/displayCountAndDocuments", async (req, res) => {
  const songs = await songDetails.find();
  res.send({"total counts = ": songs.length, songs});
})

// e) List specified Music Director songs.
app.get("/getSongsOfDirector/:director", async (req, res) => {
  const director = req.params.director;
  const songs = await songDetails.find({Music_Director: director});
  res.send({"Songs": songs});
})

// f) List specified Music Director songs sung by specified Singer
app.get("/getSongsOfDirectorAndSinger/:director/:singer", async (req, res) => {
  const director = req.params.director;
  const singer = req.params.singer;
  const songs = await songDetails.find({Music_Director: director, Singer: singer});
  res.send({"Songs": songs});
})

// g) Delete the song which you don’t like.
app.delete("/delete/:songname", async (req, res) => {
  const songname = req.params.songname;
  const result = await songDetails.deleteOne({Songname: songname});
  res.send({"message": "Song deleted successfully", result});
})

// i) List Songs sung by Specified Singer from specified films.

app.get("/listSongsOfSingerAndFilm/:singer/:film", async (req, res) => {
  const singer = req.params.singer;
  const film = req.params.film;

  const songs = await songDetails.find({Singer: singer, Film: film});
  res.send({"Songs": songs});
})

// j) Update the document by adding Actor and Actress name

app.put("/updateActorAndActress", async (req, res) => {
  const {songId, Actor, Actress} = req.body;
  const song = await songDetails.findOneAndUpdate({id: songId}, {
    $set: {
      Actor,
      Actress
    }
  }, {new: true});
  res.send({"Song": song});
})

// k) Display the above data in Browser in tabular format.

app.get("/displayAllSongsInTable", async (req, res) => {
  const songs = await songDetails.find();

  let html = "<table border=1 style='border-collapse: collapse'>"
  html = html + `<tr>
    <th>Songname</th>
    <th>Film</th>
    <th>Music_director</th>
    <th>singer</th>
    <th>Actor</th>
    <th>Actress</th
  </tr>`

  songs.map(function (song) {
    html = html + "<tr>"
    
    html = html + "<td>" + song.Songname + "</td>"
    html = html + "<td>" + song.Film + "</td>"
    html = html + "<td>" + song.Music_Director + "</td>"
    html = html + "<td>" + song.Singer + "</td>"
    html = html + "<td>" + song.Actor + "</td>"
    html = html + "<td>" + song.Actress + "</td>"

    html = html + "</tr>"
  })
  res.send(html);
})


console.log("waiting for database to connect. after connection server will start...")
mongoose.connect(db_string)
    .then(() => {
        app.listen(port, function () {
            console.log(">>>> Database connected successfully and server is started")
            console.log("http://localhost:" + port)
        })
    })
    .catch((error) => {
        console.log("problem to connect with database")
        console.log(error)
    })

// const http = require('http');

// Create a server
// const server = http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello, World!\n');
// });

// // Listen on port 3000
// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
