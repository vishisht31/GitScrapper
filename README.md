# GitSummarizer

A Node.js application that scrapes GitHub user profiles based on search queries and enriches them with AI-generated summaries using OpenAI's GPT-3.5-turbo model.

## Features

- 🔍 Search GitHub users by query
- 👤 Fetch detailed user profiles
- 🤖 Generate AI-powered summaries of user skills and expertise
- 💾 Store enriched data locally in JSON format
- 🚀 RESTful API endpoints

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- GitHub Personal Access Token
- OpenAI API Key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gitsummarizer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
GITHUB_TOKEN=your_github_personal_access_token
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

4. Create the storage directory:
```bash
mkdir storage
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token for API access | Yes |
| `OPENAI_API_KEY` | OpenAI API key for generating summaries | Yes |
| `PORT` | Server port (defaults to 3000) | No |

### Getting Your Tokens

**GitHub Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `public_repo` and `user` scopes
3. Copy the token to your `.env` file

**OpenAI API Key:**
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to your `.env` file

## Usage

### Starting the Server

```bash
npm start
```

The server will start on the specified port (default: 3000).

### API Endpoints

#### 1. Scrape Users
Searches GitHub users and enriches their profiles with AI summaries.

```http
POST /scrape?q=<search_query>
```

**Parameters:**
- `q` (required): Search query (e.g., "javascript developer", "react", "python")

**Example:**
```bash
curl -X POST "http://localhost:3000/scrape?q=javascript%20developer"
```

**Response:**
```json
[
  {
    "username": "johndoe",
    "name": "John Doe",
    "bio": "Full-stack developer passionate about React and Node.js",
    "location": "San Francisco, CA",
    "profileUrl": "https://github.com/johndoe",
    "reposUrl": "https://api.github.com/users/johndoe/repos",
    "summary": "This GitHub user appears to be an experienced full-stack developer..."
  }
]
```

#### 2. Get All Users
Retrieves all previously scraped and enriched user data.

```http
GET /user
```

**Example:**
```bash
curl http://localhost:3000/user
```

## Project Structure

```
gitsummarizer/
├── app.js                 # Main application entry point
├── package.json          # Project dependencies and scripts
├── .env                  # Environment variables (create this)
├── storage/
│   └── db.json          # Local data storage (auto-created)
├── routes/
│   └── userRoutes.js    # API route definitions
└── services/
    ├── githubService.js # GitHub API interactions
    └── aiService.js     # OpenAI integration
```

## How It Works

1. **Search**: The application searches GitHub users using the GitHub Search API
2. **Fetch**: For each user found, it fetches detailed profile information
3. **Enrich**: User profiles are sent to OpenAI GPT-3.5-turbo for AI-generated summaries
4. **Store**: Enriched data is saved locally in `storage/db.json`
5. **Serve**: Data can be retrieved via the GET endpoint

## Configuration

### Search Limits
- Fetches up to 20 users per search (2 pages × 10 users per page)
- Modify the page limit in `githubService.js` if needed:

```javascript
for (let page = 1; page <= 2; page++) { // Change 2 to desired page count
```

### AI Model
The application uses GPT-3.5-turbo by default. To change the model, modify `aiService.js`:

```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4', // Change model here
  messages: [{ role: 'user', content: prompt }],
});
```

## Error Handling

The application includes error handling for:
- Missing query parameters
- GitHub API rate limits
- OpenAI API errors
- File system operations




I