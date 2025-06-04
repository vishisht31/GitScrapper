const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeWithOpenAI(profile) {
  const prompt = `Summarize this GitHub user's profile and infer their main skills, experience level, and technical expertise:

Name: ${profile.name}
Username: ${profile.username}
Bio: ${profile.bio || 'N/A'}
Location: ${profile.location || 'N/A'}
Profile: ${profile.profileUrl}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (err) {
    return `Error generating summary: ${err.message}`;
  }
}

module.exports = { summarizeWithOpenAI };
