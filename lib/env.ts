type EnvValue = string | undefined;

function requireEnv(name: string, value = process.env[name]): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function requireUrlEnv(name: string, value = process.env[name]): string {
  const envValue = requireEnv(name, value);

  try {
    new URL(envValue);
  } catch {
    throw new Error(`Invalid URL environment variable: ${name}`);
  }

  return envValue;
}

function optionalEnv(name: string, value = process.env[name]): EnvValue {
  return value || undefined;
}

export const env = {
  DATABASE_URL: requireUrlEnv("DATABASE_URL"),
  CLERK_SECRET_KEY: requireEnv("CLERK_SECRET_KEY"),
  NEXT_PUBLIC_APP_URL: requireUrlEnv("NEXT_PUBLIC_APP_URL"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: requireEnv(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  ),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: requireEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: requireEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: requireEnv(
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
  ),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: requireEnv(
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
  ),
  STRIPE_SECRET_KEY: requireEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: requireEnv("STRIPE_WEBHOOK_SECRET"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: requireEnv(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  ),
  MUX_TOKEN_ID: requireEnv("MUX_TOKEN_ID"),
  MUX_TOKEN_SECRET: requireEnv("MUX_TOKEN_SECRET"),
  OPENAI_API_KEY: optionalEnv("OPENAI_API_KEY"),
  RESEND_API_KEY: optionalEnv("RESEND_API_KEY"),
  NEXT_PUBLIC_SUPABASE_URL: optionalEnv("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
} as const;

export type Env = typeof env;
