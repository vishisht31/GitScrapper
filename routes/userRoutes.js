const express = require('express');
const { scrapeAndEnrichUsers, getAllUsers } = require('../services/githubService');

const router = express.Router();

// Trigger scraping with query param
router.post('/scrape', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query param "q" is required' });

  try {
    const data = await scrapeAndEnrichUsers(q);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Return ALL enriched user data
router.get('/user', async (req, res) => {
  try {
    const data = getAllUsers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
