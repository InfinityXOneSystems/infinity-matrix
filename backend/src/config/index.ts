import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // AI Provider API Keys
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  
  // GitHub Integration
  githubToken: process.env.GITHUB_TOKEN || '',
  githubAppId: process.env.GITHUB_APP_ID || '',
  githubAppPrivateKey: process.env.GITHUB_APP_PRIVATE_KEY || '',
  
  // CORS Configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Database Configuration (for future use)
  databaseUrl: process.env.DATABASE_URL || '',
  
  // Feature Flags
  features: {
    aiChat: process.env.FEATURE_AI_CHAT !== 'false',
    agentManagement: process.env.FEATURE_AGENT_MANAGEMENT !== 'false',
    dataCollection: process.env.FEATURE_DATA_COLLECTION !== 'false',
    githubIntegration: process.env.FEATURE_GITHUB_INTEGRATION !== 'false',
  },
};
