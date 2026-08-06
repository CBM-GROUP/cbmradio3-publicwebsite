export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  contactReference?: string;
}

export interface LegalDocument {
  title: string;
  description: string;
  introduction: string;
  effectiveDate: string;
  sections: LegalSection[];
}
