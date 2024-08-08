const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const moment = require('moment-timezone');

// Set timezone to 'America/New_York'
const timeInNewYork = moment().tz('America/New_York').format();
console.log(timeInNewYork);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve posts.json
app.get('/data/posts.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'posts.json'));
});

// Serve posts-messages.json
app.get('/data/posts-messages.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'posts-messages.json'));
});
app.get('/data/users.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'users.json'));
});
app.get('/data/data_media.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'data_media.json'));
});
// Handle updating messages
app.post('/update-messages', (req, res) => {
    const { date, message } = req.body;
    const filePath = path.join(__dirname, 'data', 'posts-messages.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        
        const messages = JSON.parse(data);
        if (!messages[date]) {
            messages[date] = [];
        }
        messages[date].push(message);
        
        fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.send('Message updated successfully');
        });
    });
});

// Handle updating posts
app.post('/update-posts', (req, res) => {
    const newPost = req.body;

    // Basic validation
    if (!newPost.id || !newPost.title || !newPost.description) {
        return res.status(400).send('Invalid post data');
    }

    const filePath = path.join(__dirname, 'data', 'posts.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading posts file');
        
        let posts;
        try {
            posts = JSON.parse(data);
        } catch (err) {
            return res.status(500).send('Error parsing posts file');
        }
        
        posts.push(newPost);
        
        fs.writeFile(filePath, JSON.stringify(posts, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).send('Error writing posts file');
            res.send('Post added successfully');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});
