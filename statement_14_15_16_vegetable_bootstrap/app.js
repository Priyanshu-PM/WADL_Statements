const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url);

    let filepath = path.join(__dirname, "public", parsedUrl.pathname);
    if(filepath == path.join(__dirname, "public", "/")) {
        filepath = path.join(__dirname, "public", "index.html");
    }

    fs.exists(filepath, (exists) => {
        if(exists) {
            fs.readFile(filepath, (err, data) => {
                if(err) {
                    res.writeHead(500, {'Content-type': 'text/plain'});
                    res.end("Internal server error");
                }
                else {
                    const contentType = getContentType(filepath);
                    res.writeHead(200, {'Content-type': contentType});
                    res.end(data);
                }
            });
        }
        else {
            res.writeHead(404, {'Content-type': 'text/plain'});
            res.end("Page not found");
        }
    });
});

function getContentType(filepath) {
    const extname = filepath.extname;
    switch(extname) {
        case '.html':
            return "text/html";
        case '.css':
            return "text/css";
        case '.js':
            return "text/javascript";
        case '.json':
            return "application/json";
        case '.png':
            return "image/png";
        case '.jpg':
            return "image/jpg";
        default:
            return "application/octet-stream";
    }
}

server.listen(PORT, () => {
    console.log("Server listening on PORT : ", PORT);
})