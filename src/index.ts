import { execSync } from 'child_process';
import fs from 'fs';
import fsp, { writeFile } from 'fs/promises';

import env from './utils/env.js';
import getEventServiceData from './utils/get-event-service-data.js';
import getTournamentCmsData from './utils/get-tournament-cms-data.js';

const outputFolder = 'output';
const eventsFile = `${outputFolder}/events.json`;
const cmsFile = `${outputFolder}/cms.json`;

const main = async () => {
  if (!fs.existsSync(outputFolder)) {
    await fsp.mkdir(outputFolder, { recursive: true });
  }

  const tournamentsCms = await getTournamentCmsData('en-US');

  if (tournamentsCms.success) {
    await writeFile(cmsFile, JSON.stringify(tournamentsCms.data, null, 3));
  }

  const eventsData = await getEventServiceData();

  if (eventsData.success) {
    await writeFile(eventsFile, JSON.stringify(eventsData.data, null, 3));
  }

  const gitStatus = execSync('git status')?.toString('utf-8') || '';
  const isModified = gitStatus.includes(outputFolder);

  if (!isModified) {
    return;
  }

  const cmsModified = gitStatus.includes(cmsFile);
  const eventsModified = gitStatus.includes(eventsFile);

  // eslint-disable-next-line no-nested-ternary
  const commitMessage = cmsModified && eventsModified
    ? 'Tournament CMS & Events Modified'
    : cmsModified
      ? 'Tournament CMS Modified'
      : 'Events Modified';

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
