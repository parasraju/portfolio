Replaces the Geist/Doto pair with the display, body and label type system used on https://anuragdotdev.vercel.app/.

**Fonts**
- **Instrument Serif** — name, section headings, pull quote
- **Inter** — body copy
- **JetBrains Mono** — index nav, meta rows, labels, footer, preloader counters
- All three load through `next/font/google`, so they are self-hosted and preloaded.

**Notes**
- Heading scale raised to suit the serif (h1 27/35px, h2 24/28px, quote 24–34px), and the chromatic `text-shadow` on the name was dropped since the serif reads better without it; the glitch transform still runs.
- Project cover SVG labels now resolve the mono variable instead of a hardcoded stack.

**Checks**
- `npm run lint`, `tsc --noEmit`, `npm run build` pass.
- Verified in browser: all three faces report `loaded`; light, dark and 390px mobile checked with no horizontal overflow.
