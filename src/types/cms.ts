export interface TournamentCmsData {
  // only care about cms id
  tournament_display_id: string;
}

export interface TournamentInfoData {
  tournaments: TournamentCmsData[];
  _type: string;
}

export interface TournamentCmsDataResponse {
  tournament_info: TournamentInfoData;
  _title: string;
  _noIndex: boolean;
  _activeDate: string;
  lastModified: string;
  _locale: string;
  _templateName: string;
  [key: string]: | { tournament_info: TournamentCmsData } | string | boolean | TournamentInfoData;
}

export interface ScoringRulesCmsData {
  scoring_rules_info: ScoringRulesInfo
}

export interface ScoringRulesInfo {
  scoring_rules: ScoringRule[]
}

export interface ScoringRule {
  poster_description: string
  rule_name: string
  _type: string
  icon: string
  description: string
  hide_score_toast_notifications: boolean
  poster_interval_description?: string
}

export interface LeaderboardCmsData {
  leaderboard_info: LeaderboardInfo
}

export interface LeaderboardInfo {
  _type: string
  leaderboards: Leaderboard[]
}

export interface Leaderboard {
  leaderboard_id: string
}
