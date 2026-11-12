const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const jobs = require('../jobs');
const { runJob } = require('../runner');

const router = express.Router();

const HEX_COLOR = /^[0-9a-fA-F]{6}$/;
const WHOLE_NUMBER = /^\d+$/;

// POST /process/:filename?targetColor=ff0000&threshold=120 -> 202 { jobId }
router.post('/process/:filename', (req, res) => {
  const { filename } = req.params;
  const { targetColor, threshold } = req.query;

  // 1. Both query parameters are required.
  if (!targetColor || !threshold) {
    return res.status(400).json({ error: 'Missing targetColor or threshold query parameter.' });
  }

  // 2. They must also be in the format the Java app accepts.
  if (!HEX_COLOR.test(targetColor) || !WHOLE_NUMBER.test(threshold)) {
    return res.status(400).json({
      error: 'targetColor must be 6 hex digits (e.g. ff0000) and threshold a whole number (e.g. 120).',
    });
  }

  try {
    // 3. The video must be a real file inside the videos folder.
    if (path.basename(filename) !== filename) {
      throw new Error('filename contains a path');
    }
    if (!fs.existsSync(path.join(config.VIDEO_DIR, filename))) {
      throw new Error(`video not found: ${filename}`);
    }

    // 4. Save the job, start Java in the background, and answer right away.
    const job = {
      id: crypto.randomUUID(),
      filename,
      targetColor,
      threshold: Number(threshold),
    };
    jobs.createJob(job);
    runJob(job);

    res.status(202).json({ jobId: job.id });
  } catch (err) {
    console.error(`Could not start job for "${filename}":`, err.message);
    res.status(500).json({ error: 'Error starting job' });
  }
});

module.exports = router;
