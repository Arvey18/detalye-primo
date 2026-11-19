// Reads and validates environment variables once, so the rest of the app can
// import plain typed values. Add new variables here and in src/types/env.d.ts
// and .env.example.

function required(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and fill it in.`,
    )
  }
  return value
}

function url(name: keyof ImportMetaEnv): string {
  const value = required(name)
  try {
    // Normalize: drop any trailing slash so paths can be appended safely.
    return new URL(value).origin
  } catch {
    throw new Error(`Environment variable ${name} must be a full URL, got "${value}".`)
  }
}

export const env = {
  siteUrl: url('VITE_SITE_URL'),
} as const
