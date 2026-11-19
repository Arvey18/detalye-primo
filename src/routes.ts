import { index, layout, route, type RouteConfig } from '@react-router/dev/routes'

// Route table. Each page module is code-split automatically.
// Keep paths in sync with `paths` in src/config/routes.ts.
export default [
  layout('layouts/root-layout/index.tsx', [
    index('pages/home/index.tsx'),
    route('services', 'pages/services/index.tsx'),
    route('booking', 'pages/booking/index.tsx'),
    route('contact', 'pages/contact/index.tsx'),
    route('*', 'pages/not-found/index.tsx'),
  ]),

  // Resource routes, generated as static files at build time.
  route('sitemap.xml', 'resources/sitemap/index.ts'),
  route('robots.txt', 'resources/robots/index.ts'),
] satisfies RouteConfig
