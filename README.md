# Zener ID web

Landing page and auth pages for Zener ID. Next.js (App Router) and Tailwind CSS v4.

```bash
npm install
npm run dev
npm run build
```

## Structure

- `src/app/page.tsx`: landing page (hero with the verification reel, benefits, checks, how it works, platform, industries, security, FAQ, closing call to action)
- `src/app/login`, `src/app/signup`: auth pages sharing `components/auth/auth-layout.tsx`
- `src/app/api/auth/*`: route handlers the forms post to (login, signup, session)
- `src/components/header.tsx`: full-width header with dropdown menus
- `src/components/footer.tsx`: closing call to action and the full footer
- `src/components/verification-reel/`: the hero animation. Faces and countries are in `people.ts` (Unsplash photos, made-up names).
- `src/lib/site.ts`: product name, URLs, contact email
- `src/lib/session.ts`, `src/lib/auth-form.ts`: session cookie and backend calls

Brand tokens are in `src/app/globals.css`. Headings use Manrope, body text uses Inter.

## Connecting the backend

Set these in `.env.local`:

- `ZENERID_API_URL`: the backend the auth routes call
- `NEXT_PUBLIC_DASHBOARD_URL`: where people go after signing in
- `SESSION_COOKIE_DOMAIN`: the parent domain, so the dashboard reads the same cookie

The routes call `POST /v1/auth/login`, `POST /v1/auth/register` and `GET /v1/auth/me`, and expect `{ access_token, expires_in }` back. Change the paths in `src/app/api/auth/*/route.ts` and `src/lib/session.ts` if the backend differs.
