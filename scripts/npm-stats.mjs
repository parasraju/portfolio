import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { npmPackages } from "../src/components/projects/projectsData.ts";

const OUTPUT = fileURLToPath(new URL("../src/data/npm-stats.json", import.meta.url));
const NPM_STATS_EPOCH = "2015-01-10";
const MAX_RANGE_DAYS = 365;
const DAY_MS = 86_400_000;

const isoDay = (date) => date.toISOString().slice(0, 10);
const registryName = (name) => name.replace("/", "%2F");

async function getJson(url, attempts = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { accept: "application/json", "user-agent": "parasraju-portfolio-stats" } });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      if (attempt >= attempts) throw new Error(`${url}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
}

async function totalDownloads(name, createdAt) {
  const end = new Date(Date.now() - DAY_MS);
  let start = new Date(Math.max(Date.parse(createdAt ?? NPM_STATS_EPOCH), Date.parse(NPM_STATS_EPOCH)));
  let total = 0;
  while (start <= end) {
    const chunkEnd = new Date(Math.min(start.getTime() + (MAX_RANGE_DAYS - 1) * DAY_MS, end.getTime()));
    const data = await getJson(`https://api.npmjs.org/downloads/range/${isoDay(start)}:${isoDay(chunkEnd)}/${name}`);
    for (const day of data?.downloads ?? []) total += day.downloads;
    start = new Date(chunkEnd.getTime() + DAY_MS);
  }
  return total;
}

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUTPUT, "utf8"));
  } catch {
    return { updatedAt: null, packages: {} };
  }
}

const previous = await readPrevious();
const packages = {};
let refreshed = 0;

for (const pkg of npmPackages) {
  try {
    const meta = await getJson(`https://registry.npmjs.org/${registryName(pkg.name)}`);
    const total = await totalDownloads(pkg.name, meta?.time?.created);
    packages[pkg.name] = {
      total,
      version: meta?.["dist-tags"]?.latest ?? previous.packages?.[pkg.name]?.version ?? pkg.version,
      fetchedAt: new Date().toISOString(),
    };
    refreshed++;
    console.log(`${pkg.name}: ${total} total downloads`);
  } catch (error) {
    console.warn(`Keeping previous stats for ${pkg.name}: ${error.message}`);
    if (previous.packages?.[pkg.name]) packages[pkg.name] = previous.packages[pkg.name];
  }
}

if (refreshed === 0) {
  console.error("No package stats could be refreshed; leaving the existing file untouched.");
  process.exit(1);
}

const output = { updatedAt: new Date().toISOString(), source: "https://api.npmjs.org/downloads", packages };
await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Refreshed ${refreshed}/${npmPackages.length} packages → ${OUTPUT}`);
