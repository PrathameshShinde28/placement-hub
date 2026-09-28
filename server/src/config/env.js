import dotenv from 'dotenv';

// Load .env into process.env
dotenv.config();

const required = (key) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 5001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/placement-hub',

  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',

  // Multer
  RESUME_UPLOAD_DIR: process.env.RESUME_UPLOAD_DIR || 'uploads/resumes',

  // AI limits
  AI_RATE_LIMIT_WINDOW_MS: process.env.AI_RATE_LIMIT_WINDOW_MS
    ? Number(process.env.AI_RATE_LIMIT_WINDOW_MS)
    : 15 * 60 * 1000,
  AI_RATE_LIMIT_MAX: process.env.AI_RATE_LIMIT_MAX ? Number(process.env.AI_RATE_LIMIT_MAX) : 60,

  // Security
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
};



// Export helper to assert OpenAI usage at runtime
export const requireOpenAI = () => {
  required('OPENAI_API_KEY');
  return env;
};


