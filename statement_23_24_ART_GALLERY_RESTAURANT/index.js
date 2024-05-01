const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// Middleware to serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', async (req, res) => {
    try {
        // Fetch image URL from Unsplash API
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                query: 'restaurant',
                client_id: 'A_nKCsMXPjHFSFJLa5lnxvqqqXNqdE3bQwYLI5JvLS4', // Replace with your Unsplash access key
            }
        });
        const imageUrl = response.data.urls.regular;
        
        // Read homepage.html file
        const homepageHtml = await fs.readFile(path.join(__dirname, 'homepage.html'), 'utf8');
        
        // Inject dynamic content into homepage.html
        const homepageWithImage = homepageHtml.replace('${imageUrl}', imageUrl);
        
        res.send(homepageWithImage);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/aboutus', async (req, res) => {
    try {
        const aboutUsHtml = await fs.readFile(path.join(__dirname, 'aboutus.html'), 'utf8');
        res.send(aboutUsHtml);
    } catch (error) {
        console.error('Error reading aboutus.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/registerlogin', async (req, res) => {
    try {
        const registerLoginHtml = await fs.readFile(path.join(__dirname, 'registerlogin.html'), 'utf8');
        res.send(registerLoginHtml);
    } catch (error) {
        console.error('Error reading registerlogin.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
