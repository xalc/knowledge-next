export interface Skill {
  id: string;
  name: string;
  vanity_slug: string;
}

export interface BadgeTemplate {
  id: string;
  name: string;
  description: string;
  level: string;
  time_to_earn: string;
  cost: string;
  type_category: string;
  image_url: string;
  url: string;
  skills: Skill[];
}
export interface Entity {
  label: string;
  primary: boolean;
  entity: {
    id: string;
    name: string;
    type: string;
  };
}
export interface BadgeIssuer {
  summary: string;
  entities: Entity[];
}

export interface Badge {
  id: string;
  issued_at_date: string;
  expires_at_date: string | null;
  issued_to: string;
  state: string;
  badge_template: BadgeTemplate;
  issuer: BadgeIssuer;
  image_url: string;
  evidence: string[];
}
