import env from './env.js';

import type { AuthData } from '../types/account-service.js';
import type { DataResponse } from '../types/event-service';

export default async (auth: AuthData) => {
  const res = await fetch(
    `https://events-public-service-live.ol.epicgames.com/api/v1/events/Fortnite/data/${env.EPIC_ACCOUNT_ID}`,
    {
      headers: {
        Authorization: `${auth.token_type} ${auth.access_token}`,
      },
    },
  );

  if (!res.ok) {
    console.log('failed fetching event service data', res.status, res.statusText, await res.text());

    return {
      success: false,
    };
  }

  const data = <DataResponse>(await res.json());

  data.events.forEach((ev) => {
    ev.eventWindows.sort((a, b) => a.eventWindowId.localeCompare(b.eventWindowId));
  });

  data.events.sort((a, b) => a.eventId.localeCompare(b.eventId));
  data.templates.sort((a, b) => a.eventTemplateId.localeCompare(b.eventTemplateId));
  data.leaderboardDefs.sort((a, b) => a.leaderboardDefId.localeCompare(b.leaderboardDefId));
  data.payoutTables = Object.fromEntries(
    Object.entries(data.payoutTables)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  data.scoringRuleSets = Object.fromEntries(
    Object.entries(data.scoringRuleSets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        // sort tracked stats too
        value.sort((a, b) => a.trackedStat.localeCompare(b.trackedStat));

        return [key, value];
      }),
  );

  const result = {
    ...data,
    scoreLocationScoringRuleSets: undefined,
    scoreLocationPayoutTables: undefined,
    resolvedWindowLocations: undefined,
  };

  return {
    success: true,
    data: Object.fromEntries(
      Object.entries(result)
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
  };
};
