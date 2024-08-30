import type { LeaderboardCmsData, Leaderboard } from '../types/cms';

export default async (locale = 'en') => {
  const res = await fetch(
    `https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/leaderboardinformation?lang=${locale}`,
  );

  if (!res.ok) {
    console.log('failed fetching tournament leaderboards cms data', res.status, res.statusText, await res.text());

    return {
      success: false,
    };
  }

  const data = <LeaderboardCmsData>(await res.json());

  return {
    success: true,
    data: data.leaderboard_info.leaderboards
      .sort((a, b) => a.leaderboard_id.localeCompare(b.leaderboard_id))
      .map((x) => <Leaderboard>Object.fromEntries(
        Object.entries(x)
          .sort(([a], [b]) => a.localeCompare(b)),
      )),
  };
};
