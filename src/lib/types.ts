import { links } from '@/lib/data';

// Derives the SectionName type from the names in the links array
export type SectionName = (typeof links)[number]['name'];
