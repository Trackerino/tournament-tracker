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
