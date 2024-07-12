export interface DataResponse {
  scoringRuleSets: Record<string, SimplifiedScoringRuleSet[]>;
  payoutTables: Record<string, unknown>;
  events: SimplifiedEvent[];
  templates: SimplifiedTemplate[];
  leaderboardDefs: SimplifiedLeaderboardDef[];
  eventSeries: unknown[];

  // these must be deleted
  scoreLocationScoringRuleSets: Record<string, unknown>;
  scoreLocationPayoutTables: Record<string, unknown>;
  resolvedWindowLocations: Record<string, unknown>;
}

export interface SimplifiedEvent {
  eventId: string;
  eventWindows: SimplifiedEventWindow[];
}

export interface SimplifiedEventWindow {
  eventWindowId: string;
}

export interface SimplifiedTemplate {
  eventTemplateId: string;
}

export interface SimplifiedLeaderboardDef {
  leaderboardDefId: string;
}

export interface SimplifiedScoringRuleSet {
  trackedStat: string;
}
