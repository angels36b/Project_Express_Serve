require('dotenv').config();

const requiredVars = ['DATABASE_URL', 'API_TOKEN', 'MOODLE_LOGIN', 'MOODLE_FULL_NAME'];

for (const key of requiredVars) {
  if (!process.env[key] || !process.env[key].trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL.trim(),
  apiToken: process.env.API_TOKEN.trim(),
  moodleLogin: process.env.MOODLE_LOGIN.trim(),
  moodleFullName: process.env.MOODLE_FULL_NAME.trim()
};