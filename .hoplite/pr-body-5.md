**Development**
- On the home page, Development is now three plain links: **Terminal**, **Gear** and **Setup**. No terminal styling.
- Each link opens its own page: `/terminal/`, `/gear/`, `/setup/`. Each page shows "Coming soon" until items are added in `src/components/setup/setupData.ts`, and links to the other two.
- Removed the terminal preview component and its typing/caret CSS.

**Loading screen removed**
- Deleted the preloader, the loading provider and the session flag. The site appears straight away; the scroll reveals and grid-line entrance still play, triggered when the page mounts.

**Personal**
- The home page shows 4 books at exactly the same size as the movie posters (both 123×185 at desktop width).

**Checks**
- `npm run lint`, `tsc --noEmit` and `npm run build` pass (Terminal, Gear and Setup are now separate static routes).
- Browser: no `#preloader` on a fresh session, and the hero is visible within 400ms. Development links go to `/terminal/`, `/gear/`, `/setup/`, and clicking Terminal opens "My terminal". Book and poster sizes match exactly.
