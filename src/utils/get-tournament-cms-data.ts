import type { TournamentCmsDataResponse, TournamentCmsData } from '../types/cms';

export default async (locale = 'en') => {
  const res = await fetch(
    `https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/tournamentinformation?lang=${locale}`,
  );

  if (!res.ok) {
    console.log('failed fetching tourney cms data', res.status, res.statusText, await res.text());

    return {
      success: false,
    };
  }

  const data = <TournamentCmsDataResponse>(await res.json());
  const cmsData: Record<string, TournamentCmsData> = {};

  Object.entries(data).forEach(([, value]) => {
    if (typeof value !== 'object') {
      return;
    }

    if ('_templateName' in value
      && value._templateName === 'tournament-reference'
      && 'tournament_info' in value
    ) {
      const tournamentCms = value.tournament_info;

      cmsData[tournamentCms.tournament_display_id] = tournamentCms;

      return;
    }

    if ('tournaments' in value) {
      value.tournaments.forEach((tournamentCms) => {
        cmsData[tournamentCms.tournament_display_id] = tournamentCms;
      });
    }
  });

  const cmsSortedData: Record<string, TournamentCmsData> = {};

  Object.entries(cmsData).forEach(([, tournamentCms]) => {
    cmsSortedData[tournamentCms.tournament_display_id] = <TournamentCmsData>Object.fromEntries(
      Object.entries(tournamentCms)
        .sort(([a], [b]) => a.localeCompare(b)),
    );
  });

  return {
    success: true,
    data: Object.entries(cmsSortedData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, tournamentCms]) => tournamentCms),
  };
};
