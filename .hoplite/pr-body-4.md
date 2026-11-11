Restructures the site around a top navbar and dedicated pages, and adds a Spotify last-played line, a Development section and a Personal section.

**Navigation**
- Small, transparent navbar on every page: Home · Work · Blogs + theme toggle. It frosts slightly once you scroll.
- ⌘K search gains a **Pages** group for all new routes.

**Pages**
- `/work/`: projects (cover images removed), npm packages, and skills trimmed to React, Node.js, Tailwind, Shadcn UI, Motion, JavaScript, TypeScript, Python, C++, SQL, Git, GitHub.
- `/blogs/`: all posts. Hovering one post blurs the rest of the page.
- `/experience/`: the full experience list.
- `/setup/`: Terminal, Gear and Setup windows, with placeholders until you fill in `src/components/setup/setupData.ts`.
- `/books/` and `/movies/`: covers/posters with short notes on each.

**Home**
- Projects and skills removed.
- Short Experience and Blog previews with “See full experiences” / “See full blog” buttons (blog preview has the same hover blur).
- New **Development** section (terminal preview linking to `/setup/`) and **Personal** section (book shelf, then movie posters, each linking to its page).

**Spotify last played**
- Shown under “Paras Raju · 20”. Because the site is a static export, `/api/spotify` is generated at build time, the same way the GitHub routes are.
- `deploy.yml` passes `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN` to the build and now also rebuilds every 30 minutes so the track stays fresh.
- The line stays hidden until those secrets exist. `node scripts/spotify-auth.mjs` mints the refresh token.

**Assets**
- Book covers come from Open Library and movie posters from Wikipedia. Both are stored in `public/assets/`.

**Checks**
- `npm run lint`, `tsc --noEmit` and `npm run build` pass (14 static routes).
- Checked in the browser: all routes return 200, and home, work, blogs, setup, books and movies look right in light and dark at 1440px and 390px with no horizontal overflow and no broken images.
- Spotify was checked against a mocked API response. The hover-blur selectors were checked by forcing the hover rules, because headless Chrome reports no hover-capable pointer.
