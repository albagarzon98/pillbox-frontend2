//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/PillBox-FrontEnd')));

// Handle all routes by serving index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/PillBox-FrontEnd/index.html'));
});

// Export the Express app for Vercel
module.exports = app;
