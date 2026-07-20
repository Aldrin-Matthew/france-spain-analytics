import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchPlayerStats } from './fetchers/playerstats.js';
import { fetchManagingMadrid } from './fetchers/managingMadrid.js';
import { fetchFotmobNewsletter } from './fetchers/fotmobNewsletter.js';
import { fetchEspn } from './fetchers/espn.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, '../../data/extended_stats.json');

const jobs = [
  { name: 'playerstats.football', run: fetchPlayerStats },
  { name: 'managingmadrid.com', run: fetchManagingMadrid },
  { name: 'fotmob newsletter', run: fetchFotmobNewsletter },
  { name: 'espn.com', run: fetchEspn },
];

async function main() {
  const results = {};
  const errors = [];

  for (const job of jobs) {
    process.stdout.write(`Fetching ${job.name}... `);
    try {
      results[job.name] = await job.run();
      console.log('ok');
    } catch (err) {
      console.log('FAILED');
      errors.push({ source: job.name, message: err.message });
    }
  }

  const output = {
    generated_at: new Date().toISOString(),
    note:
      'Additive enrichment data for human review — not auto-merged into ../frontend/src/data/matchData.json. ' +
      'Cross-check numbers here against the hand-curated dataset before pulling anything in.',
    results,
    errors,
  };

  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  console.log(`\nWrote ${OUT_PATH}`);
  if (errors.length) {
    console.log(`${errors.length} source(s) failed — see "errors" in the output file.`);
  }
}

main();
