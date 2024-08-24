import { execSync } from 'child_process';
import fs from 'fs';
import fsp, { writeFile } from 'fs/promises';

import env from './utils/env.js';
import getAuth from './utils/get-auth.js';
import getEventServiceData from './utils/get-event-service-data.js';
import getTournamentCmsData from './utils/get-tournament-cms-data.js';
import killToken from './utils/kill-token.js';

const outputFolder = 'output';
const eventsFile = `${outputFolder}/events.json`;
const devEventsFile = `${outputFolder}/events-dev.json`;
const cmsFile = `${outputFolder}/cms.json`;

const main = async () => {
  if (!fs.existsSync(outputFolder)) {
    await fsp.mkdir(outputFolder, { recursive: true });
  }

  const tournamentsCms = await getTournamentCmsData('en-US');

  if (tournamentsCms.success) {
    await writeFile(cmsFile, JSON.stringify(tournamentsCms.data, null, 3));
  }

  const auth = await getAuth();
  const eventsData = await getEventServiceData(auth, 'live');
  const devEventsData = await getEventServiceData(auth, 'prod');

  if (eventsData.success) {
    await writeFile(eventsFile, JSON.stringify(eventsData.data, null, 3));
  }

  if (devEventsData.success) {
    await writeFile(devEventsFile, JSON.stringify(devEventsData.data, null, 3));
  }

  await killToken(auth);

  const gitStatus = execSync('git status')?.toString('utf-8') || '';
  const changes: string[] = [];

  if (gitStatus.includes(cmsFile)) {
    changes.push('CMS');
  }

  if (gitStatus.includes(eventsFile)) {
    changes.push('Events');
  }

  if (gitStatus.includes(devEventsFile)) {
    changes.push('Events (Dev)');
  }

  if (!changes.length) {
    return;
  }

  const commitMessage = `Modified ${changes.join(', ')}`

  console.log(commitMessage);

  if (env.GIT_DO_NOT_COMMIT?.toLowerCase() === 'true') {
    return;
  }

  execSync('git add output');
  execSync('git config user.email "github-actions@github.com"');
  execSync('git config user.name "GitHub Actions"');
  execSync('git config commit.gpgsign false');
  execSync(`git commit -m "${commitMessage}"`);

  if (env.GIT_DO_NOT_PUSH?.toLowerCase() === 'true') {
    return;
  }

  execSync('git push');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
