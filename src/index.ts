import { execSync } from 'child_process';
import fs from 'fs';
import fsp, { writeFile } from 'fs/promises';

import env from './utils/env.js';
import getEventServiceData from './utils/get-event-service-data.js';
import getTournamentCmsData from './utils/get-tournament-cms-data.js';

const outputFolder = 'output';
const eventsFile = `${outputFolder}/events.json`;
const cmsFile = `${outputFolder}/cms.json`;

// for future webhook?
const getCacheFile = async <T = unknown>(file: string) => {
  if (!fs.existsSync(file)) {
    return null;
  }

  const content = await fsp.readFile(file, 'utf-8');

  return <T>JSON.parse(content);
};

const main = async () => {
  if (!fs.existsSync(outputFolder)) {
    await fsp.mkdir(outputFolder, { recursive: true });
  }

  const tournamentsCms = await getTournamentCmsData('en-US');

  console.log(tournamentsCms);

  if (tournamentsCms.success) {
    await writeFile(cmsFile, JSON.stringify(tournamentsCms.data, null, 3));
  }

  const eventsData = await getEventServiceData();

  console.log(eventsData);

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

  // let fieldValue = '';
  // let overflowCount = 0;

  // updatedAssets.forEach((data) => {
  //   const assetText = `- ${data.assetId} (v${data.asset.meta.revision})\n`;

  //   if (fieldValue.length + assetText.length > 1000) {
  //     overflowCount += 1;

  //     return;
  //   }

  //   fieldValue += assetText;
  // });

  // if (overflowCount) {
  //   fieldValue += `- + ${overflowCount} more`;
  // }

  // const webhookResponse = await needle('post', env.WEBHOOK_URL, {
  //   content: '<@&1232656166551683102>',
  //   embeds: [{
  //     title: 'Update',
  //     color: 1752220, // Aqua
  //     description: `**${updatedAssets.length}** assets updated`,
  //     fields: [{
  //       name: 'Assets',
  //       value: fieldValue,
  //     }],
  //   }],
  // }, {
  //   json: true,
  // });

  // if (webhookResponse.statusCode !== 204) {
  //   console.log(webhookResponse.statusCode, webhookResponse.statusMessage, webhookResponse.body);

  //   throw new Error('Failed to send webhook');
  // }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
