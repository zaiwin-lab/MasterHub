export interface OrgDetails {
  ngo: string;
  provider: string;
  title: string;
}

export interface ProgrammeInfo {
  category: string;
  target: string;
  expected: string;
  location: string;
  date: string;
  duration: string;
  budget: string;
  objective: string;
}

export interface Materials {
  links: string;
  /** Names of files attached via the single multi-file upload box. */
  files: string[];
  notes: string;
}

export type Scores = Record<string, number>;

export const initialOrg: OrgDetails = { ngo: '', provider: '', title: '' };

export const initialProgramme: ProgrammeInfo = {
  category: '',
  target: '',
  expected: '',
  location: '',
  date: '',
  duration: '',
  budget: '',
  objective: '',
};

export const initialMaterials: Materials = { links: '', files: [], notes: '' };
