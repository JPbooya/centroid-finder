const express = require('express');
const config = require('./config');
const videosRouter = require('./routes/videos');

const app = express();

// Serve the raw videos and the result CSVs as static files.
app.use('/videos', express.static(config.VIDEO_DIR));
app.use('/results', express.static(config.RESULTS_DIR));

// API routes
app.use(videosRouter);

module.exports = app;
