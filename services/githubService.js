const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { summarizeWithOpenAI } = require('./aiService');

const DB_PATH = path.join(__dirname, '../storage/db.json');
const GITHUB_HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
};

function saveToDB(users) {
  const db = { latest: users };  // Only store latest data under "latest"
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getAllUsers() {
  const db = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH)) : {};
  return db.latest || [];  // Return only the latest data
}

async function fetchGitHubUsers(query, page = 1) {
  const url = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=10`;
  const { data } = await axios.get(url, { headers: GITHUB_HEADERS });
  return data.items || [];
}

async function fetchUserDetails(username) {
  const profileUrl = `https://api.github.com/users/${username}`;
  const { data } = await axios.get(profileUrl, { headers: GITHUB_HEADERS });
  return {
    username: data.login,
    name: data.name,
    bio: data.bio,
    location: data.location,
    profileUrl: data.html_url,
    reposUrl: data.repos_url,
  };
}

async function scrapeAndEnrichUsers(query) {
  let allUsers = [];

  for (let page = 1; page <= 2; page++) {
    const users = await fetchGitHubUsers(query, page);
    for (const user of users) {
      const profile = await fetchUserDetails(user.login);
      const aiSummary = await summarizeWithOpenAI(profile);
      allUsers.push({ ...profile, summary: aiSummary });
    }
  }

  saveToDB(allUsers);  // Save only the latest data
  return allUsers;
}

module.exports = {
  scrapeAndEnrichUsers,
  getAllUsers,
};
