import type { ReactNode } from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
} from 'react-router'
import { siteConfig } from '@config'
import '@styles/index.css'

// App shell (replaces index.html). React Router renders this at build time for
// every prerendered page, then hydrates it in the browser.

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

/** Last-resort error screen for unexpected crashes (404s are handled by the not-found page). */
export function ErrorBoundary({ error }: { error: unknown }) {
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong.'

  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <title>{`Error — ${siteConfig.name}`}</title>
      <h1 className="font-heading text-3xl font-semibold">{message}</h1>
      <p className="text-muted-foreground">Please refresh the page or try again later.</p>
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="w-full overflow-x-auto rounded-lg bg-muted p-4 text-left text-xs">
          {error.stack}
        </pre>
      )}
    </main>
  )
}
