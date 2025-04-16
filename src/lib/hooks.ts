import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useActiveSectionContext } from '@/context/active-section-context';
import type { SectionName } from './types';

export function useSectionInView(sectionName: SectionName, threshold = 0.8) {
  const { ref, inView } = useInView({
    threshold: threshold, // Percentage of the section that needs to be visible
  });
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();

  useEffect(() => {
    // Update active section only if in view and enough time has passed since last click
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection(sectionName);
    }
  }, [inView, setActiveSection, timeOfLastClick, sectionName]);

  return { ref };
}
