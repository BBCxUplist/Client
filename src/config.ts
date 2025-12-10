// Centralized configuration for environment variables
// Import all environment variables here and export them with proper typing

interface Config {
  // Supabase configuration
  supabase: {
    url: string;
    anonKey: string;
  };

  // API configuration
  api: {
    url: string;
    wsUrl: string;
  };

  // Application configuration
  app: {
    isDevelopment: boolean;
    isProduction: boolean;
  };
}

// Validate required environment variables
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Get and validate environment variables
const getConfig = (): Config => {
  return {
    supabase: {
      url: validateEnvVar(
        'VITE_SUPABASE_URL',
        import.meta.env.VITE_SUPABASE_URL
      ),
      anonKey: validateEnvVar(
        'VITE_SUPABASE_ANON_KEY',
        import.meta.env.VITE_SUPABASE_ANON_KEY
      ),
    },

    api: {
      url: validateEnvVar('VITE_API_URL', import.meta.env.VITE_API_URL),
      wsUrl: import.meta.env.VITE_WS_URL || 'wss://localhost:3000/ws',
    },

    app: {
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
    },
  };
};

// Export the configuration
export const config = getConfig();

// Export individual configurations for convenience
export const { supabase, api, app } = config;

// Export default
export default config;
