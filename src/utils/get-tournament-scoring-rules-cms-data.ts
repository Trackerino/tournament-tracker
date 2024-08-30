import type { ScoringRulesCmsData, ScoringRule } from '../types/cms';

export default async (locale = 'en') => {
  const res = await fetch(
    `https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/scoringrulesinformation?lang=${locale}`,
  );

  if (!res.ok) {
    console.log('failed fetching tournament scoring rules cms data', res.status, res.statusText, await res.text());

    return {
      success: false,
    };
  }

  const data = <ScoringRulesCmsData>(await res.json());

  return {
    success: true,
    data: data.scoring_rules_info.scoring_rules
      .sort((a, b) => a.rule_name.localeCompare(b.rule_name))
      .map((x) => <ScoringRule>Object.fromEntries(
        Object.entries(x)
          .sort(([a], [b]) => a.localeCompare(b)),
      )),
  };
};
