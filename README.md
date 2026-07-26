# 🎁 Free Study Guide Registration

A mobile-first campaign site for a "Free Study Guide" lucky-draw registration —
green & white glassmorphism UI, a step-by-step form with a growing-leaf
progress indicator, and an admin panel backed by Google Sheets.

## Stack

- **Frontend:** React + Vite, React Router
- **Backend:** Google Apps Script (Web App), deployed as a REST-style JSON API
- **Database:** Google Sheets (one row per registration)
- **Hosting:** Vercel

## Project structure

```
study-guide-registration/
├── src/
│   ├── components/        # All UI screens & shared form fields
│   ├── data/options.js     # Dropdown option lists (districts, subjects, etc.)
│   ├── api/api.js          # Fetch wrapper for the Apps Script backend
│   ├── styles/tokens.css   # Design tokens: colors, type, glass, buttons
│   ├── App.jsx             # Routes
│   └── main.jsx            # Entry point
├── google-apps-script/
│   ├── Code.gs             # Backend API (registration, admin, lucky draw, export)
│   └── appsscript.json     # Apps Script manifest
├── vercel.json
├── .env.example
└── package.json
```

## 1. Set up the Google Sheet + Apps Script backend

1. Create a new Google Sheet (this will be your database).
2. Open **Extensions → Apps Script**.
3. Delete the default `Code.gs` content and paste in the contents of
   `google-apps-script/Code.gs` from this project. Also add
   `appsscript.json` (enable "Show manifest file" under Project Settings).
4. In the Apps Script editor, run `setupAdminCredentials` once (select it in
   the function dropdown → Run) to create your admin login. **Then edit the
   username/password inside that function, or set them directly under
   Project Settings → Script Properties**, before you deploy publicly.
5. Click **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the generated `/exec` URL.
7. The first time a registration is submitted, the script auto-creates a
   `Registrations` tab with all required columns.

## 2. Configure the frontend

```bash
cp .env.example .env
# then edit .env and paste your Apps Script /exec URL into VITE_API_URL
```

## 3. Run locally

```bash
npm install
npm run dev
```

## 4. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add `VITE_API_URL` as an Environment Variable in the Vercel project settings
(Project → Settings → Environment Variables), matching your `.env` value,
then redeploy.

## Admin panel

- URL: `/admin`
- Default credentials (⚠️ **change immediately** via `setupAdminCredentials`
  or Script Properties): `admin` / `changeme123`
- Dashboard, registrations table (search/view/edit/delete/export), lucky
  draw (randomly select N winners from pending entries), and a winners view
  with one-tap call + "mark delivered".

## Notes & customization

- Colors, type, and spacing all live in `src/styles/tokens.css` as CSS
  variables — change the palette there without touching components.
- Dropdown content (districts, subjects, occupations, guide types) lives in
  `src/data/options.js`.
- The lucky draw uses a Fisher–Yates shuffle over all rows currently marked
  `Pending`, so it's safe to top up registrations and re-run the draw later
  for additional slots.
- Excel export is served as CSV (opens natively in Excel/Sheets) directly
  from the Apps Script `doGet` endpoint — no extra libraries needed.
