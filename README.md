# sunday-notes

Athletic-apparel storefront built with Next.js 15 (App Router). All content lives in `data/store.json`; there is no database.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
# or
npm run build && npm start
```

## Admin

- URL: `/admin`
- Username: `admin`
- Password: `12345` (hardcoded in `lib/auth.ts`)

From the admin you can add, edit and delete products, and edit the homepage (brand name, announcement bar, hero slides, "New and trending" tiles, "Shop by colour" tiles, feature banner, "What's new" carousel). Changes are written straight to `data/store.json`. Uploaded images are stored in `data/uploads/` and served from `/uploads/<file>`.

Because data is written to the local filesystem, run it on a Node server (`next start`, a VPS, Docker). Serverless hosts such as Vercel have a read-only filesystem, so admin saves will not persist there.

## Structure

- `app/(shop)` – storefront: home, `/c/[slug]` collections, `/p/[slug]` product page, `/search`, `/bag`
- `app/admin` – login and dashboard
- `app/api/admin` – JSON API used by the dashboard (protected by `middleware.ts`)
- `components/` – UI components; `components/admin/` – dashboard forms
- `lib/store.ts` – reads and writes `data/store.json`
