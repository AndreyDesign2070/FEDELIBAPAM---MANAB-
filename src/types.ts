export interface Publication {
  id: string;
  title: string;
  date: string;
  sport: string;
  category: string;
  content: string;
  imageUrl: string;
  videoUrl?: string;
  viewsCount: number;
  isPinned?: boolean;
}

export interface StandingTeam {
  position: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface TournamentStanding {
  id: string;
  leagueName: string;
  sportName: string;
  categoryName: string;
  teams: StandingTeam[];
}

export interface AffiliatedLeague {
  id: string;
  name: string;
  location: string;
  activeTeams: number;
  president: string;
  foundedYear: string;
}

export interface TransparencyDocument {
  id: string;
  documentName: string;
  dateReleased: string;
  fileSize: string;
  category: string; // "Presupuestos" | "Estatutos" | "Resoluciones" | "Actas"
  url: string;
  originalFileName?: string;
}

export interface SportDefinition {
  id: string;
  name: string;
  categories: string[];
}

export interface FEDELIBAPAMState {
  shieldUrl: string;
  coverUrl: string;
  introductionText: string;
  contactEmail: string;
  contactPhone: string;
  facebookUrl: string;
  publications: Publication[];
  standings: TournamentStanding[];
  leagues: AffiliatedLeague[];
  transparencyDocuments: TransparencyDocument[];
  footerBadge?: string;
  footerTitle?: string;
  footerContent?: string;
  bottomFooterDescription?: string;
  bottomFooterLocation?: string;
  bottomFooterShareText?: string;
  sports: SportDefinition[];
}
