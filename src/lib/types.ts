import { links } from '@/lib/data';

// Add Estimate page section names to the union type
export type SectionName =
  | (typeof links)[number]['name']
  | 'Intro'
  | 'Scope'
  | 'Options'
  | 'Timeline'
  | 'Email';
