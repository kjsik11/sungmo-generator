const ENVIRONMENT_VARIABLES = ['MONGODB_URI', 'MONGODB_NAME', 'FONT_PATH'] as const;

export type EnvironmentVariable = typeof ENVIRONMENT_VARIABLES[number];
